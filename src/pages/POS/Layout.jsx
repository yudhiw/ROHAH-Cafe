import { useEffect, useState } from 'react'
import { NAV_ITEMS, ROLES } from '../../data/constants'

export default function Layout({ user, activeScreen, setActiveScreen, onLogout, children }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const allowedScreens = ROLES[user?.role]?.screens || []
  const visibleNav = NAV_ITEMS.filter((n) => allowedScreens.includes(n.id))
  const currentNav = NAV_ITEMS.find((n) => n.id === activeScreen)
  const roleConfig = ROLES[user?.role] || {}

  const timeStr = time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div className="flex h-screen bg-pos-bg text-cream overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[74px] bg-pos-sidebar flex flex-col items-center py-4 border-r border-pos-border flex-shrink-0">
        {/* Logo */}
        <div className="mb-6">
          <img
            src="/uploads/logo-1777600521020.png"
            alt="ROHAH"
            style={{ width: 36, height: 36, filter: 'brightness(0) sepia(1) hue-rotate(10deg) saturate(2) brightness(0.7)', objectFit: 'contain' }}
          />
        </div>

        {/* Nav buttons */}
        <nav className="flex-1 flex flex-col gap-1 w-full px-2">
          {visibleNav.map((nav) => {
            const active = activeScreen === nav.id
            return (
              <button
                key={nav.id}
                onClick={() => setActiveScreen(nav.id)}
                title={nav.label}
                className={`flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-lg transition-all w-full ${
                  active
                    ? 'bg-gold/20 text-gold'
                    : 'text-cream/40 hover:bg-pos-card hover:text-cream/80'
                }`}
              >
                <span className="text-xl leading-none">{nav.icon}</span>
                <span className="text-[9px] font-medium leading-none">{nav.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom: Home + Logout */}
        <div className="flex flex-col gap-1 w-full px-2">
          <a
            href="/#"
            title="Beranda"
            className="flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-lg text-cream/30 hover:text-cream/70 transition-colors"
          >
            <span className="text-xl leading-none">🏠</span>
            <span className="text-[9px]">Home</span>
          </a>
          <button
            onClick={onLogout}
            title="Logout"
            className="flex flex-col items-center gap-0.5 py-2.5 px-1 rounded-lg text-pos-red/50 hover:text-pos-red transition-colors"
          >
            <span className="text-xl leading-none">🚪</span>
            <span className="text-[9px]">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[50px] bg-pos-sidebar border-b border-pos-border flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xl">{currentNav?.icon}</span>
            <span className="font-medium text-cream/90 text-sm">{currentNav?.label}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-cream/40 text-xs font-mono">{timeStr}</span>
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: roleConfig.color + '33', color: roleConfig.color, border: `1px solid ${roleConfig.color}44` }}
              >
                {user?.name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <div className="text-xs font-medium text-cream/90 leading-none">{user?.name}</div>
                <div className="text-[10px] leading-none mt-0.5" style={{ color: roleConfig.color }}>
                  {roleConfig.label}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
