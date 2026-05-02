const galleryItems = [
  { emoji: '🏛️',  label: 'Interior Utama',   wide: true, tall: true },
  { emoji: '☕',  label: 'Kopi Signature',    wide: false, tall: false },
  { emoji: '🍜',  label: 'Mie Yamin Tasik',  wide: false, tall: false },
  { emoji: '🌿',  label: 'Sudut Hijau',       wide: true, tall: false },
  { emoji: '🎂',  label: 'Sajian Spesial',    wide: false, tall: false },
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

        <div
          className="reveal"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: 'repeat(2, 220px)',
            gap: '12px',
            height: '452px',
          }}
        >
          {/* Item 1: spans 2 cols, 2 rows */}
          <GalleryItem item={galleryItems[0]} style={{ gridColumn: 'span 2', gridRow: 'span 2' }} />
          {/* Item 2 */}
          <GalleryItem item={galleryItems[1]} style={{}} />
          {/* Item 3 */}
          <GalleryItem item={galleryItems[2]} style={{}} />
          {/* Item 4: spans 2 cols */}
          <GalleryItem item={galleryItems[3]} style={{ gridColumn: 'span 2' }} />
          {/* Item 5 */}
          <GalleryItem item={galleryItems[4]} style={{}} />
        </div>
      </div>
    </section>
  )
}

function GalleryItem({ item, style }) {
  return (
    <div
      className="relative rounded-xl overflow-hidden group cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, #2a1a08 0%, #1a1008 100%)',
        border: '1px solid #3a2e1a',
        ...style,
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl mb-3 opacity-60">{item.emoji}</div>
        <p className="font-cormorant italic text-gold/50 text-sm">{item.label}</p>
      </div>
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-gold/70 flex items-center justify-center">
          <span className="text-gold text-xl">+</span>
        </div>
      </div>
      {/* Bottom label on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-espresso/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <p className="text-cream/90 text-xs font-medium">{item.label}</p>
      </div>
    </div>
  )
}
