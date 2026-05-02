export default function Hero() {
  return (
    <section className="h-screen flex overflow-hidden">
      {/* LEFT */}
      <div
        className="flex-1 bg-espresso flex flex-col justify-center px-12 lg:px-20 relative z-10"
        style={{ clipPath: 'polygon(0 0, 95% 0, 100% 100%, 0 100%)' }}
      >
        <p className="font-cormorant italic text-gold tracking-widest text-sm mb-6">
          Cafe &middot; Boutique &middot; Space &middot; Est. 2023
        </p>
        <h1 className="font-playfair text-4xl lg:text-6xl text-cream leading-tight mb-6">
          Rasa yang Hangat,{' '}
          <em className="text-gold not-italic italic">Hangat,</em>
          <br />
          Kenangan Abadi
        </h1>
        <p className="text-cream/70 font-light text-base lg:text-lg mb-10 max-w-sm leading-relaxed">
          Setiap cangkir mengisahkan kisah tersendiri. Nikmati kehangatan kopi pilihan dan sajian lezat di sudut nyaman kota Bekasi.
        </p>
        <div className="flex gap-4 flex-wrap">
          <a
            href="#menu"
            className="px-8 py-3 bg-gold text-espresso font-medium rounded hover:bg-gold-light transition-colors text-sm"
          >
            Jelajahi Menu
          </a>
          <a
            href="#about"
            className="px-8 py-3 border border-cream/50 text-cream font-medium rounded hover:bg-cream/10 transition-colors text-sm"
          >
            Tentang Kami
          </a>
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative w-1/2 lg:w-5/12 flex-shrink-0 -ml-8">
        <img
          src="/uploads/officeROHAH.jpg"
          alt="ROHAH Cafe interior"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-espresso/30" />

        {/* Badge */}
        <div className="absolute bottom-12 right-8 w-20 h-20 rounded-full border-2 border-gold flex flex-col items-center justify-center bg-espresso/80">
          <span className="font-playfair text-gold text-xl font-bold leading-none">23</span>
          <span className="font-cormorant text-gold/80 text-xs tracking-widest">Est.</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20">
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-gold/60 animate-pulse" />
        <span className="text-cream/50 text-xs tracking-widest font-light">scroll</span>
      </div>
    </section>
  )
}
