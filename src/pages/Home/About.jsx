const stats = [
  { value: '30+', label: 'Menu Pilihan' },
  { value: '2+',  label: 'Tahun Berdiri' },
  { value: '5★',  label: 'Rating' },
]

export default function About() {
  return (
    <section id="about" className="bg-espresso py-24 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="reveal">
          <p className="font-cormorant italic text-gold tracking-widest text-sm mb-4">
            — Tentang Kami
          </p>
          <h2 className="font-playfair text-4xl lg:text-5xl text-cream leading-tight mb-6">
            Dari Dapur Rumah,<br />
            <em className="text-gold">Ke Meja Anda</em>
          </h2>
          <div className="w-16 h-px bg-gold mb-8" />
          <p className="text-cream/70 font-light leading-relaxed mb-5">
            ROHAH Cafe lahir dari kecintaan terhadap cita rasa autentik dan kehangatan
            kebersamaan. Berlokasi di Grand Wisata, Bekasi, kami menyajikan sajian
            nusantara dan minuman kopi pilihan yang dibuat dengan sepenuh hati.
          </p>
          <p className="text-cream/70 font-light leading-relaxed mb-10">
            Setiap hidangan kami terinspirasi dari resep turun-temurun yang dipadukan
            dengan sentuhan modern. Kami percaya bahwa makanan terbaik adalah yang dibuat
            dengan bahan segar dan penuh kasih sayang.
          </p>

          {/* Stats */}
          <div className="flex gap-10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="font-playfair text-3xl text-gold font-bold">{s.value}</div>
                <div className="font-cormorant text-cream/60 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - image placeholder */}
        <div className="reveal">
          <div
            className="w-full aspect-square rounded-lg overflow-hidden relative"
            style={{
              background: 'repeating-linear-gradient(45deg, #2a1a08 0px, #2a1a08 10px, #1a1008 10px, #1a1008 20px)',
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">☕</div>
              <p className="font-cormorant italic text-gold/60 text-lg">Cafe Ambiance</p>
            </div>
            {/* Corner accent */}
            <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-gold/40" />
            <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-gold/40" />
          </div>
        </div>
      </div>
    </section>
  )
}
