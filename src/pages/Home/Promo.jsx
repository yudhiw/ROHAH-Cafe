const promos = [
  {
    icon: '🍜',
    tag: 'Bundling Hemat',
    title: 'Mie + Minuman',
    desc: 'Paket lengkap mie pilihan + minuman favoritmu dengan harga spesial.',
    badge: 'Setiap hari',
    original: 53000,
    price: 42000,
    color: 'from-brown-mid/30 to-espresso',
  },
  {
    icon: '☕',
    tag: 'Happy Hour',
    title: 'Coffee 2 for 1',
    desc: 'Buy 1 Get 1 untuk semua menu kopi. Ajak temanmu dan nikmati berdua!',
    badge: 'Sen–Jum 14:00–16:00',
    original: null,
    price: null,
    label: 'Buy 1 Get 1',
    color: 'from-gold/20 to-espresso',
  },
  {
    icon: '🎂',
    tag: 'Birthday Treat',
    title: 'Gratis di Hari Ulang Tahunmu',
    desc: 'Tunjukkan KTP-mu dan dapatkan satu minuman gratis di hari ulang tahunmu.',
    badge: 'Berlaku setiap hari',
    original: null,
    price: null,
    label: 'Gratis!',
    color: 'from-pos-red/20 to-espresso',
  },
]

const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID')

export default function Promo() {
  return (
    <section id="promo" className="bg-cream-dark py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 reveal">
          <p className="font-cormorant italic text-brown-mid tracking-widest text-sm mb-3">
            — Penawaran Spesial
          </p>
          <h2 className="font-playfair text-4xl lg:text-5xl text-espresso">
            Promo <em className="text-gold">Terkini</em>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 reveal">
          {promos.map((p, i) => (
            <div
              key={i}
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${p.color} border border-espresso/20`}
            >
              <div className="p-6">
                <div className="text-4xl mb-4">{p.icon}</div>
                <span className="inline-block text-xs font-medium text-gold bg-gold/10 border border-gold/30 rounded-full px-3 py-1 mb-3">
                  {p.tag}
                </span>
                <h3 className="font-playfair text-cream text-xl mb-2">{p.title}</h3>
                <p className="text-cream/60 text-sm font-light leading-relaxed mb-4">{p.desc}</p>

                <div className="flex items-end justify-between">
                  <div>
                    {p.original && (
                      <div className="text-cream/40 text-sm line-through">{fmt(p.original)}</div>
                    )}
                    {p.price != null ? (
                      <div className="font-cormorant text-gold text-2xl font-semibold">
                        {fmt(p.price)}
                      </div>
                    ) : (
                      <div className="font-cormorant text-gold text-2xl font-semibold">
                        {p.label}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-cream/50 font-light max-w-[100px] text-right leading-snug">
                    {p.badge}
                  </span>
                </div>
              </div>

              {/* Decorative corner */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gold/10 border border-gold/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
