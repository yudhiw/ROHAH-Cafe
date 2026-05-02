export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-espresso border-t border-gold/10 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo */}
        <img
          src="/uploads/logo-1777600521020.png"
          alt="ROHAH Cafe"
          style={{ height: 36, filter: 'brightness(0) invert(1) opacity(0.6)' }}
        />

        {/* Copyright */}
        <p className="text-cream/40 text-xs font-light">
          &copy; {year} ROHAH Cafe. All rights reserved.
        </p>

        {/* Social links */}
        <div className="flex items-center gap-4">
          <a
            href="https://instagram.com/rohah.cafe"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/50 hover:text-gold transition-colors text-xs font-medium"
          >
            Instagram
          </a>
          <span className="text-cream/20">|</span>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cream/50 hover:text-gold transition-colors text-xs font-medium"
          >
            Facebook
          </a>
          <span className="text-cream/20">|</span>
          <a
            href="/#/pos"
            className="text-gold/60 hover:text-gold transition-colors text-xs font-medium"
          >
            POS System
          </a>
        </div>
      </div>
    </footer>
  )
}
