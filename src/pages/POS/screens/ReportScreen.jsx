import { useState } from 'react'
import { fmt } from '../../../data/constants'

const PERIODS = ['Hari Ini', 'Minggu Ini', 'Bulan Ini']

const REPORT_DATA = {
  'Hari Ini': {
    revenue: 1847000, orders: 38, items: 94, avg: 48605,
    topItems: [
      { name: 'Cappuccino',          qty: 18, rev: 450000 },
      { name: 'Mie Yamin Tasik Manis', qty: 14, rev: 490000 },
      { name: 'Nasi Goreng Special',  qty: 11, rev: 407000 },
      { name: 'Thai Tea',             qty: 10, rev: 250000 },
      { name: 'Americano Hot/Ice',    qty: 9,  rev: 225000 },
    ],
    recent: [
      { id: 'TXN-0001', time: '19:42', table: 'T3', total: 95000,  method: 'QRIS' },
      { id: 'TXN-0002', time: '19:15', table: 'T1', total: 120000, method: 'Cash' },
      { id: 'TXN-0003', time: '18:50', table: 'T7', total: 55000,  method: 'QRIS' },
      { id: 'TXN-0004', time: '18:22', table: 'T5', total: 200000, method: 'Debit' },
      { id: 'TXN-0005', time: '17:44', table: 'T2', total: 75000,  method: 'Cash' },
    ],
  },
  'Minggu Ini': {
    revenue: 11230000, orders: 218, items: 520, avg: 51514,
    topItems: [
      { name: 'Cappuccino',           qty: 98,  rev: 2450000 },
      { name: 'Mie Yamin Tasik Manis', qty: 75, rev: 2625000 },
      { name: 'Nasi Goreng Special',   qty: 62, rev: 2294000 },
      { name: 'Thai Tea',              qty: 58, rev: 1450000 },
      { name: 'Latte',                 qty: 45, rev: 1125000 },
    ],
    recent: [
      { id: 'TXN-0218', time: 'Jum 19:42', table: 'T3', total: 95000,  method: 'QRIS' },
      { id: 'TXN-0217', time: 'Jum 18:10', table: 'T6', total: 140000, method: 'Cash' },
      { id: 'TXN-0216', time: 'Kam 20:05', table: 'T4', total: 88000,  method: 'QRIS' },
      { id: 'TXN-0215', time: 'Kam 19:30', table: 'T2', total: 175000, method: 'Debit' },
      { id: 'TXN-0214', time: 'Rab 18:00', table: 'T8', total: 62000,  method: 'Transfer' },
    ],
  },
  'Bulan Ini': {
    revenue: 42850000, orders: 847, items: 2100, avg: 50590,
    topItems: [
      { name: 'Cappuccino',           qty: 380, rev: 9500000 },
      { name: 'Mie Yamin Tasik Manis', qty: 295, rev: 10325000 },
      { name: 'Nasi Goreng Special',   qty: 240, rev: 8880000 },
      { name: 'Thai Tea',              qty: 220, rev: 5500000 },
      { name: 'Latte',                 qty: 180, rev: 4500000 },
    ],
    recent: [
      { id: 'TXN-0847', time: '30 Apr 19:42', table: 'T3', total: 95000,  method: 'QRIS' },
      { id: 'TXN-0846', time: '30 Apr 18:10', table: 'T6', total: 140000, method: 'Cash' },
      { id: 'TXN-0845', time: '29 Apr 20:05', table: 'T4', total: 88000,  method: 'QRIS' },
      { id: 'TXN-0844', time: '29 Apr 19:30', table: 'T2', total: 175000, method: 'Debit' },
      { id: 'TXN-0843', time: '28 Apr 18:00', table: 'T8', total: 62000,  method: 'Transfer' },
    ],
  },
}

const KPI_CONFIG = [
  { key: 'revenue', label: 'Total Pendapatan', icon: '💰', color: '#C8963E', format: fmt },
  { key: 'orders',  label: 'Total Order',      icon: '📋', color: '#5090e0', format: (n) => n.toLocaleString('id-ID') },
  { key: 'items',   label: 'Item Terjual',     icon: '🍽️', color: '#4caf7d', format: (n) => n.toLocaleString('id-ID') },
  { key: 'avg',     label: 'Rata-rata Transaksi', icon: '📊', color: '#e07830', format: fmt },
]

const METHOD_COLOR = { Cash: '#4caf7d', QRIS: '#5090e0', Debit: '#e07830', Transfer: '#C8963E' }

export default function ReportScreen() {
  const [period, setPeriod] = useState('Hari Ini')
  const data = REPORT_DATA[period]

  const maxRev = Math.max(...data.topItems.map((i) => i.rev))

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Period toggle */}
      <div className="flex gap-2 mb-6">
        {PERIODS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
              period === p ? 'bg-gold text-espresso border-gold' : 'border-pos-border text-cream/60 hover:border-gold/30'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {KPI_CONFIG.map((k) => (
          <div key={k.key} className="bg-pos-card border border-pos-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{k.icon}</span>
              <span className="text-cream/50 text-xs">{k.label}</span>
            </div>
            <div className="font-playfair text-xl" style={{ color: k.color }}>
              {k.format(data[k.key])}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top items */}
        <div className="bg-pos-card border border-pos-border rounded-xl p-5">
          <h3 className="font-playfair text-cream/90 mb-4">Menu Terlaris</h3>
          <div className="space-y-4">
            {data.topItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: i === 0 ? '#C8963E33' : '#3a2e1a', color: i === 0 ? '#C8963E' : '#a09080' }}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-cream/80 text-xs truncate">{item.name}</span>
                    <span className="text-cream/40 text-xs ml-2 flex-shrink-0">{item.qty}x</span>
                  </div>
                  <div className="h-1.5 bg-pos-bg rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(item.rev / maxRev) * 100}%`, backgroundColor: '#C8963E' }}
                    />
                  </div>
                </div>
                <div className="text-gold text-xs font-medium flex-shrink-0">{fmt(item.rev)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-pos-card border border-pos-border rounded-xl p-5">
          <h3 className="font-playfair text-cream/90 mb-4">Transaksi Terbaru</h3>
          <div className="space-y-2">
            {data.recent.map((txn) => (
              <div key={txn.id} className="flex items-center gap-3 py-2 border-b border-pos-border/50 last:border-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-cream/80 text-xs font-medium">{txn.id}</span>
                    <span className="text-cream/30 text-xs">{txn.table}</span>
                  </div>
                  <div className="text-cream/40 text-[10px]">{txn.time}</div>
                </div>
                <div className="text-right">
                  <div className="text-gold text-xs font-semibold">{fmt(txn.total)}</div>
                  <div
                    className="text-[10px] font-medium"
                    style={{ color: METHOD_COLOR[txn.method] || '#a09080' }}
                  >
                    {txn.method}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
