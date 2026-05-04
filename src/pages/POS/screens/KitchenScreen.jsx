import { useState, useEffect, useRef } from 'react'
import { DB } from '../../../lib/db'

const STATUS_CONFIG = {
  pending: { label: 'Menunggu', color: '#e07830', bg: 'border-pos-orange/40 bg-pos-orange/5',  btn: 'bg-pos-orange/20 text-pos-orange border-pos-orange/30', next: 'cooking', btnLabel: 'Mulai Masak' },
  cooking: { label: 'Dimasak',  color: '#5090e0', bg: 'border-pos-blue/40 bg-pos-blue/5',      btn: 'bg-pos-blue/20 text-pos-blue border-pos-blue/30',       next: 'ready',   btnLabel: 'Siap Saji' },
  ready:   { label: 'Siap',     color: '#4caf7d', bg: 'border-pos-green/40 bg-pos-green/5',    btn: 'bg-pos-green/20 text-pos-green border-pos-green/30',   next: 'done',    btnLabel: 'Selesai' },
  done:    { label: 'Selesai',  color: '#6b7280', bg: 'border-gray-700 bg-gray-900/50',         btn: '',                                                      next: null,      btnLabel: '' },
}

// Sample data shown when queue is empty (demo)
const SAMPLE_ORDERS = [
  { id: 'ORD-001', table: 'T3', status: 'pending',  createdAt: Date.now() - 3  * 60000, items: [{ name: 'Mie Yamin Tasik Manis', qty: 2 }, { name: 'Cappuccino', qty: 2 }] },
  { id: 'ORD-002', table: 'T5', status: 'cooking',  createdAt: Date.now() - 12 * 60000, items: [{ name: 'Nasi Sop Buntut', qty: 1 }, { name: 'Americano', qty: 1 }] },
  { id: 'ORD-003', table: 'T1', status: 'ready',    createdAt: Date.now() - 18 * 60000, items: [{ name: 'Chicken Steak', qty: 1 }, { name: 'Latte', qty: 2 }] },
]

function playNotification() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const note = (freq, start, dur) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.25, ctx.currentTime + start)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
      osc.start(ctx.currentTime + start)
      osc.stop(ctx.currentTime + start + dur + 0.05)
    }
    note(660, 0,    0.12)
    note(880, 0.18, 0.12)
    note(660, 0.36, 0.18)
  } catch {}
}

export default function KitchenScreen() {
  const [orders, setOrders] = useState([])
  const [now, setNow] = useState(Date.now())
  const [soundOn, setSoundOn] = useState(false)
  const prevPendingRef = useRef(-1)   // -1 = not yet initialized
  const usingSampleRef = useRef(false)

  // Load & poll orders
  useEffect(() => {
    const load = async () => {
      const dbOrders = await DB.getKitchenOrders()
      let source
      if (dbOrders.length > 0) {
        source = dbOrders
        usingSampleRef.current = false
      } else {
        source = SAMPLE_ORDERS
        usingSampleRef.current = true
      }

      setOrders(source)

      const pendingCount = source.filter((o) => o.status === 'pending').length
      if (soundOn && prevPendingRef.current >= 0 && pendingCount > prevPendingRef.current) {
        playNotification()
      }
      prevPendingRef.current = pendingCount
    }

    load()
    const t = setInterval(load, 5000)
    return () => clearInterval(t)
  }, [soundOn])

  // Clock
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [])

  const advance = async (id) => {
    const order = orders.find((o) => o.id === id)
    if (!order) return
    const next = STATUS_CONFIG[order.status]?.next
    if (!next) return

    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: next } : o))

    if (!usingSampleRef.current) {
      await DB.updateKitchenOrder(id, next)
    }
  }

  const visible = orders.filter((o) => o.status !== 'done')
  const done    = orders.filter((o) => o.status === 'done')

  return (
    <div className="h-full overflow-y-auto p-4 lg:p-6">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {['pending', 'cooking', 'ready'].map((s) => {
            const count = orders.filter((o) => o.status === s).length
            const cfg = STATUS_CONFIG[s]
            return (
              <div key={s} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${cfg.bg}`}>
                <span style={{ color: cfg.color }}>{cfg.label}</span>
                <span className="font-bold" style={{ color: cfg.color }}>{count}</span>
              </div>
            )
          })}
          {done.length > 0 && (
            <span className="text-cream/30 text-xs self-center">{done.length} selesai</span>
          )}
        </div>

        {/* Sound toggle */}
        <button
          onClick={() => {
            if (!soundOn) playNotification()
            setSoundOn((v) => !v)
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all ${
            soundOn
              ? 'border-pos-green/50 bg-pos-green/10 text-pos-green'
              : 'border-pos-border text-cream/40 hover:text-cream/70'
          }`}
          title="Aktifkan notifikasi bunyi saat order baru masuk"
        >
          <span>{soundOn ? '🔔' : '🔕'}</span>
          <span>{soundOn ? 'Bunyi ON' : 'Bunyi OFF'}</span>
        </button>
      </div>

      {visible.length === 0 && (
        <div className="text-center py-20 text-cream/20">
          <div className="text-5xl mb-3">👨‍🍳</div>
          <p>Tidak ada order aktif</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.map((order) => {
          const cfg = STATUS_CONFIG[order.status]
          const elapsed = Math.floor((now - order.createdAt) / 60000)
          const isLate = elapsed > 10

          return (
            <div key={order.id} className={`rounded-xl border p-4 flex flex-col gap-3 ${cfg.bg}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-playfair text-lg text-cream/90">{order.table}</div>
                  <div className="text-xs text-cream/40">{order.id}</div>
                  {order.customer && (
                    <div className="text-xs text-cream/50 mt-0.5">{order.customer}</div>
                  )}
                </div>
                <div className="text-right">
                  <div
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ color: cfg.color, backgroundColor: cfg.color + '22' }}
                  >
                    {cfg.label}
                  </div>
                  <div className={`text-xs mt-1 ${isLate ? 'text-pos-orange font-medium' : 'text-cream/40'}`}>
                    {elapsed}m {isLate ? '⚠️' : ''}
                  </div>
                </div>
              </div>

              <div className="space-y-1 flex-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-pos-card border border-pos-border flex items-center justify-center font-bold text-gold text-[10px] flex-shrink-0">
                      {item.qty}
                    </span>
                    <span className="text-cream/80">{item.name}</span>
                  </div>
                ))}
              </div>

              {cfg.next && (
                <button
                  onClick={() => advance(order.id)}
                  className={`py-2 rounded-lg text-xs font-medium border transition-all hover:opacity-90 ${cfg.btn}`}
                >
                  {cfg.btnLabel}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
