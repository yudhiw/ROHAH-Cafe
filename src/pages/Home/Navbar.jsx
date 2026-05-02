import { useState, useEffect } from 'react'

const links = [
  { label: 'About',   id: 'about'   },
  { label: 'Menu',    id: 'menu'    },
  { label: 'Promo',   id: 'promo'   },
  { label: 'Gallery', id: 'gallery' },
  { label: 'Contact', id: 'contact' },
]

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(() => window.scrollY > 60)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-cream/95 backdrop-blur-md shadow-sm'
        : 'bg-cream/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center">
          <img
            src="/uploads/logo-1777600521020.png"
            alt="ROHAH Cafe"
            style={{
              height: 44,
              filter: 'brightness(0) sepia(1) hue-rotate(160deg) saturate(0.6) brightness(0.6)',
            }}
          />
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => scrollTo(l.id)}
              className="text-sm font-medium tracking-wide text-espresso hover:text-gold transition-colors"
            >
              {l.label}
            </button>
          ))}
          <a
            href="/#/pos"
            className="text-sm font-medium px-3 py-1.5 rounded border border-gold text-gold hover:bg-gold hover:text-cream transition-colors"
          >
            POS
          </a>
          <button
            onClick={() => scrollTo('menu')}
            className="text-sm font-medium px-4 py-2 rounded bg-espresso text-cream hover:bg-brown-mid transition-colors"
          >
            Lihat Menu
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2 text-espresso"
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-cream shadow-lg px-6 py-4 flex flex-col gap-4 border-t border-espresso/10">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => { scrollTo(l.id); setOpen(false) }}
              className="text-left text-espresso font-medium text-sm hover:text-gold transition-colors"
            >
              {l.label}
            </button>
          ))}
          <a
            href="/#/pos"
            onClick={() => setOpen(false)}
            className="text-gold border border-gold text-sm font-medium px-3 py-1.5 rounded text-center hover:bg-gold hover:text-cream transition-colors"
          >
            POS System
          </a>
          <button
            onClick={() => { scrollTo('menu'); setOpen(false) }}
            className="text-sm font-medium px-4 py-2 rounded bg-espresso text-cream text-center hover:bg-brown-mid transition-colors"
          >
            Lihat Menu
          </button>
        </div>
      )}
    </nav>
  )
}
