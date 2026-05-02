import { useState, useEffect } from 'react'

const STATUS_CONFIG = {
  pending: { label: 'Menunggu', color: '#e07830', bg: 'border-pos-orange/40 bg-pos-orange/5',  btn: 'bg-pos-orange/20 text-pos-orange border-pos-orange/30', next: 'cooking', btnLabel: 'Mulai Masak' },
  cooking: { label: 'Dimasak',  color: '#5090e0', bg: 'border-pos-blue/40 bg-pos-blue/5',      btn: 'bg-pos-blue/20 text-pos-blue border-pos-blue/30',       next: 'ready',   btnLabel: 'Siap Saji' },
  ready:   { label: 'Siap',     color: '#4caf7d', bg: 'border-pos-green/40 bg-pos-green/5',    btn: 'bg-pos-green/20 text-pos-green border-pos-green/30',   next: 'done',    btnLabel: 'Selesai' },
  done:    { label: 'Selesai',  color: '#6b7280', bg: 'border-gray-700 bg-gray-900/50',         btn: '',                                                      next: null,      btnLabel: '' },
}

const SAMPLE_ORDERS = [
  {
    id: 'ORD-001', table: 'T3', status: 'pending',
    createdAt: Date.now() - 3 * 60000,
    items: [{ name: 'Mie Yamin Tasik Manis', qty: 2 }, { name: 'Cappuccino', qty: 2 }],
  },
  {
    id: 'ORD-002', table: 'T5', status: 'cooking',
    createdAt: Date.now() - 12 * 60000,
    items: [{ name: 'Nasi Sop Buntut', qty: 1 }, { name: 'Americano Hot/Ice', qty: 1 }, { name: 'Thai Tea', qty: 1 }],
  },
  {
    id: 'ORD-003', table: 'T1', status: 'ready',
    createdAt: Date.now() - 18 * 60000,
    items: [{ name: 'Chicken Steak', qty: 1 }, { name: 'Latte', qty: 2 }],
  },
  {
    id: 'ORD-004', table: 'T7', status: 'pending',
    createdAt: Date.now() - 1 * 60000,
    items: [{ name: 'Pempek (7 pcs)', qty: 1 }, { name: 'Matcha Latte', qty: 1 }],
  },
  {
    id: 'ORD-005', table: 'T2', status: 'cooking',
    createdAt: Date.now() - 7 * 60000,
    items: [{ name: 'Nasi Goreng Special', qty: 2 }, { name: 'Teh Dilmah Earl Grey', qty: 1 }, { name: 'Dark Chocolate', qty: 1 }],
  },
]

export default function KitchenScreen() {
  const [orders, setOrders] = useState(SAMPLE_ORDERS)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [])

  const advance = (id) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o
        const next = STATUS_CONFIG[o.status]?.next
        if (!next) return o
        return { ...o, status: next }
      })
    )
  }

  const visible = orders.filter((o) => o.status !== 'done')
  const done = orders.filter((o) => o.status === 'done')

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <div className="flex gap-3">
          {['pending', 'cooking', 'ready'].map((s) => {
            const count = orders.filter((o) => o.status === s).length
            const cfg = STATUS_CONFIG[s]
            return (
              <div key={s} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${cfg.bg}`}>
                <span className="text-xs" style={{ color: cfg.color }}>{cfg.label}</span>
                <span className="font-bold text-sm" style={{ color: cfg.color }}>{count}</span>
              </div>
            )
          })}
        </div>
        {done.length > 0 && (
          <span className="text-cream/30 text-xs">{done.length} selesai</span>
        )}
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
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-playfair text-lg text-cream/90">{order.table}</div>
                  <div className="text-xs text-cream/40">{order.id}</div>
                </div>
                <div className="text-right">
                  <div
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{ color: cfg.color, backgroundColor: cfg.color + '22' }}
                  >
                    {cfg.label}
                  </div>
                  <div className={`text-xs mt-1 ${isLate ? 'text-pos-orange' : 'text-cream/40'}`}>
                    {elapsed}m {isLate ? '⚠️' : ''}
                  </div>
                </div>
              </div>

              {/* Items */}
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

              {/* Action */}
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
