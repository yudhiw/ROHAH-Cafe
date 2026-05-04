const TESTIMONIALS = [
  {
    name: 'Budi Santoso',
    avatar: 'BS',
    since: 'Pelanggan sejak 2022',
    rating: 5,
    text: 'Kopi di ROHAH memang beda. Setiap pagi jadi lebih bermakna dengan Kopi Signature-nya. Suasananya cozy banget, jadi favorit tempat kerja saya!',
  },
  {
    name: 'Sari Dewi',
    avatar: 'SD',
    since: 'Food Blogger · 2023',
    rating: 5,
    text: 'Mie Yamin Tasik-nya autentik banget, bikin kangen kampung halaman. Dan Chicken Steak-nya juara! Highly recommended buat yang cari makan enak tapi tetap cozy.',
  },
  {
    name: 'Ahmad Fauzi',
    avatar: 'AF',
    since: 'Pelanggan sejak 2021',
    rating: 5,
    text: 'Sudah coba hampir semua menu dan belum ada yang mengecewakan. Staff ramah, tempat bersih, harga terjangkau. ROHAH selalu jadi pilihan pertama keluarga kami!',
  },
]

function Stars({ n }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`text-base ${i < n ? 'text-gold' : 'text-espresso/15'}`}>★</span>
      ))}
    </div>
  )
}

export default function Testimonial() {
  return (
    <section id="testimonial" className="bg-cream-dark py-24 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12 reveal">
          <p className="font-cormorant italic text-brown-mid tracking-widest text-sm mb-3">
            — Kata Mereka
          </p>
          <h2 className="font-playfair text-4xl lg:text-5xl text-espresso">
            Cerita dari <em className="text-gold">Pelanggan</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 reveal">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-cream rounded-2xl p-7 border border-espresso/8 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="font-playfair text-5xl text-gold/20 leading-none -mt-1 mb-1">"</div>
              <Stars n={t.rating} />
              <p className="text-espresso/70 text-sm leading-relaxed mb-6 font-light">{t.text}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-espresso/8">
                <div className="w-10 h-10 rounded-full bg-espresso flex items-center justify-center text-cream text-sm font-semibold flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-medium text-espresso text-sm">{t.name}</div>
                  <div className="text-espresso/40 text-xs">{t.since}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
