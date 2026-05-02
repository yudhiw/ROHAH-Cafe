import { useState } from 'react'
import { INIT_TABLES } from '../../../data/constants'

const STATUS_CYCLE = { available: 'occupied', occupied: 'reserved', reserved: 'available' }
const STATUS_CONFIG = {
  available: { label: 'Tersedia',  color: '#4caf7d', dot: 'bg-pos-green',  bg: 'border-pos-green/30 bg-pos-green/5' },
  occupied:  { label: 'Terisi',    color: '#e07830', dot: 'bg-pos-orange', bg: 'border-pos-orange/30 bg-pos-orange/5' },
  reserved:  { label: 'Reservasi', color: '#5090e0', dot: 'bg-pos-blue',   bg: 'border-pos-blue/30 bg-pos-blue/5' },
}

export default function TableScreen() {
  const [tables, setTables] = useState(INIT_TABLES)

  const cycleStatus = (id) => {
    setTables((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: STATUS_CYCLE[t.status], pax: STATUS_CYCLE[t.status] === 'occupied' ? 1 : 0 }
          : t
      )
    )
  }

  const counts = {
    available: tables.filter((t) => t.status === 'available').length,
    occupied:  tables.filter((t) => t.status === 'occupied').length,
    reserved:  tables.filter((t) => t.status === 'reserved').length,
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Summary */}
      <div className="flex gap-4 mb-6 flex-wrap">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${cfg.bg}`}>
            <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            <span className="text-cream/70 text-xs">{cfg.label}</span>
            <span className="font-bold text-sm" style={{ color: cfg.color }}>{counts[key]}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {tables.map((table) => {
          const cfg = STATUS_CONFIG[table.status]
          return (
            <div
              key={table.id}
              className={`rounded-xl border p-5 flex flex-col gap-3 ${cfg.bg} transition-all`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-playfair text-2xl text-cream/90">{table.label}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
                    <span className="text-xs" style={{ color: cfg.color }}>{cfg.label}</span>
                  </div>
                </div>
                <span className="text-2xl opacity-60">
                  {table.status === 'available' ? '✅' : table.status === 'occupied' ? '🪑' : '🔒'}
                </span>
              </div>

              {/* Pax */}
              {table.status === 'occupied' && table.pax > 0 && (
                <div className="text-cream/60 text-xs">
                  {table.pax} tamu
                </div>
              )}

              {/* Action */}
              <button
                onClick={() => cycleStatus(table.id)}
                className="mt-auto py-2 rounded-lg text-xs font-medium border transition-all hover:opacity-80"
                style={{
                  borderColor: cfg.color + '44',
                  color: cfg.color,
                  backgroundColor: cfg.color + '11',
                }}
              >
                Ubah Status
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
