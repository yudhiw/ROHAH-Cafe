import { useState, useEffect } from 'react'
import { DB } from '../../../lib/db'

const TIER_CONFIG = {
  Bronze:   { color: '#cd7f32', bg: '#cd7f3222', threshold: 0 },
  Silver:   { color: '#a8a9ad', bg: '#a8a9ad22', threshold: 500 },
  Gold:     { color: '#C8963E', bg: '#C8963E22', threshold: 1500 },
  Platinum: { color: '#e5e4e2', bg: '#e5e4e222', threshold: 4000 },
}

export default function LoyaltyScreen() {
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    DB.getCustomers().then((data) => {
      setCustomers(data || [])
      setLoading(false)
    })
  }, [])

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone || '').includes(search)
  )

  const tierCounts = Object.keys(TIER_CONFIG).reduce((acc, t) => {
    acc[t] = customers.filter((c) => c.tier === t).length
    return acc
  }, {})

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Tier summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(TIER_CONFIG).map(([tier, cfg]) => (
          <div
            key={tier}
            className="rounded-xl border p-4 flex items-center gap-3"
            style={{ borderColor: cfg.color + '44', backgroundColor: cfg.bg }}
          >
            <div className="text-2xl">
              {tier === 'Bronze' ? '🥉' : tier === 'Silver' ? '🥈' : tier === 'Gold' ? '🥇' : '💎'}
            </div>
            <div>
              <div className="font-medium text-sm" style={{ color: cfg.color }}>{tier}</div>
              <div className="text-cream/50 text-xs">{tierCounts[tier] || 0} pelanggan</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Add */}
      <div className="flex gap-3 mb-5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau nomor HP..."
          className="flex-1 px-4 py-2.5 bg-pos-card border border-pos-border rounded-lg text-cream text-sm placeholder:text-cream/30 focus:outline-none focus:border-gold/50"
        />
        <button className="px-4 py-2.5 bg-gold text-espresso rounded-lg text-sm font-medium hover:bg-gold-light transition-colors flex-shrink-0">
          + Pelanggan Baru
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-cream/30">
          <div className="text-3xl mb-2">⏳</div>
          <p className="text-sm">Memuat data...</p>
        </div>
      ) : (
        <div className="bg-pos-card border border-pos-border rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-6 px-5 py-3 border-b border-pos-border text-cream/40 text-xs font-medium">
            <span className="col-span-2">Nama</span>
            <span>No. HP</span>
            <span>Tier</span>
            <span className="text-right">Poin</span>
            <span className="text-right">Kunjungan / Terakhir</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-pos-border/50">
            {filtered.length === 0 ? (
              <div className="text-center py-10 text-cream/30 text-sm">Tidak ada pelanggan ditemukan</div>
            ) : (
              filtered.map((c) => {
                const tierCfg = TIER_CONFIG[c.tier] || TIER_CONFIG.Bronze
                return (
                  <div key={c.id || c.phone} className="grid grid-cols-6 px-5 py-3 hover:bg-pos-card-hover transition-colors items-center">
                    <div className="col-span-2">
                      <div className="text-cream/90 text-sm font-medium">{c.name}</div>
                    </div>
                    <div className="text-cream/60 text-xs">{c.phone}</div>
                    <div>
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ color: tierCfg.color, backgroundColor: tierCfg.bg }}
                      >
                        {c.tier}
                      </span>
                    </div>
                    <div className="text-right font-semibold text-sm" style={{ color: tierCfg.color }}>
                      {c.points?.toLocaleString('id-ID')}
                    </div>
                    <div className="text-right text-xs text-cream/50">
                      <span className="text-cream/70">{c.visits}x</span>
                      <span className="mx-1 text-cream/20">/</span>
                      <span>{c.last_visit}</span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
