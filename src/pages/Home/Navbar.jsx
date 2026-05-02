import { useState, useEffect } from 'react'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Menu', href: '#menu' },
  { label: 'Promo', href: '#promo' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navBg = scrolled
    ? 'bg-cream/92 backdrop-blur-md shadow-sm'
    : 'bg-transparent'

  const linkColor = scrolled ? 'text-espresso' : 'text-cream'
  const logoFilter = scrolled ? '' : 'brightness-0 invert'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center">
          <img
            src="/uploads/logo-1777600521020.png"
            alt="ROHAH Cafe"
            style={{ height: 44, filter: scrolled ? 'brightness(0) sepia(1) hue-rotate(10deg) saturate(0.5)' : 'brightness(0) invert(1)' }}
          />
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-gold ${linkColor}`}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/#/pos"
            className={`text-sm font-medium px-3 py-1.5 rounded border transition-colors hover:bg-gold hover:text-espresso hover:border-gold ${scrolled ? 'border-gold text-gold' : 'border-gold/70 text-gold'}`}
          >
            POS
          </a>
          <a
            href="#menu"
            className="text-sm font-medium px-4 py-2 rounded bg-espresso text-cream hover:bg-brown-mid transition-colors"
          >
            Lihat Menu
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden flex flex-col gap-1.5 p-2 ${linkColor}`}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-cream shadow-lg px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-espresso font-medium text-sm hover:text-gold transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/#/pos"
            onClick={() => setOpen(false)}
            className="text-gold border border-gold text-sm font-medium px-3 py-1.5 rounded text-center"
          >
            POS System
          </a>
          <a
            href="#menu"
            onClick={() => setOpen(false)}
            className="text-sm font-medium px-4 py-2 rounded bg-espresso text-cream text-center"
          >
            Lihat Menu
          </a>
        </div>
      )}
    </nav>
  )
}
