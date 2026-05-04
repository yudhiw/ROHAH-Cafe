// Upload foto ke: public_html/images/gallery/1.jpg s/d 5.jpg
const galleryItems = [
  { id: 1, emoji: '🏛️', label: 'Interior Utama',  style: { gridColumn: 'span 2', gridRow: 'span 2' } },
  { id: 2, emoji: '☕',  label: 'Kopi Signature',  style: {} },
  { id: 3, emoji: '🍜',  label: 'Mie Yamin Tasik', style: {} },
  { id: 4, emoji: '🌿',  label: 'Sudut Hijau',     style: { gridColumn: 'span 2' } },
  { id: 5, emoji: '🎂',  label: 'Sajian Spesial',  style: {} },
]

export default function Gallery() {
  return (
    <section id="gallery" className="bg-espresso py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 reveal">
          <p className="font-cormorant italic text-gold/70 tracking-widest text-sm mb-3">
            — Galeri
          </p>
          <h2 className="font-playfair text-4xl lg:text-5xl text-cream">
            Suasana <em className="text-gold">ROHAH</em>
          </h2>
        </div>

        {/* Desktop grid */}
        <div
          className="reveal hidden md:grid"
          style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(2, 220px)',
            gap: '12px',
          }}
        >
          {galleryItems.map((item) => (
            <GalleryItem key={item.id} item={item} style={item.style} />
          ))}
        </div>

        {/* Mobile: simple 2-col grid */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {galleryItems.map((item) => (
            <GalleryItem key={item.id} item={item} style={{ height: 160 }} />
          ))}
        </div>
      </div>
    </section>
  )
}

function GalleryItem({ item, style }) {
  return (
    <div
      className="relative rounded-xl overflow-hidden group cursor-pointer"
      style={{ background: 'linear-gradient(135deg,#2a1a08,#1a1008)', border: '1px solid #3a2e1a', ...style }}
    >
      {/* Emoji placeholder always behind */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl mb-2 opacity-50">{item.emoji}</div>
        <p className="font-cormorant italic text-gold/40 text-sm">{item.label}</p>
      </div>

      {/* Real photo on top — hides emoji when loaded */}
      <img
        src={`/images/gallery/${item.id}.jpg`}
        alt={item.label}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => { e.target.style.visibility = 'hidden' }}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
        <p className="text-cream/90 text-xs font-medium">{item.label}</p>
      </div>
    </div>
  )
}
