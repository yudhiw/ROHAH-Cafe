import { useState } from 'react'
import { MENU_DATA } from '../../data/menu'

const categories = Object.keys(MENU_DATA)

const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID')

export default function Menu() {
  const [activeTab, setActiveTab] = useState(categories[0])

  const items = MENU_DATA[activeTab] || []

  return (
    <section id="menu" className="bg-cream py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 reveal">
          <p className="font-cormorant italic text-brown-mid tracking-widest text-sm mb-3">
            — Sajian Pilihan Kami
          </p>
          <h2 className="font-playfair text-4xl lg:text-5xl text-espresso">
            Menu <em className="text-gold">ROHAH</em>
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 reveal">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 text-sm font-medium rounded-full border transition-all ${
                activeTab === cat
                  ? 'bg-espresso text-gold border-espresso'
                  : 'border-espresso/20 text-espresso/70 hover:border-espresso/50 hover:text-espresso'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 reveal">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-warm-white rounded-xl p-5 border border-espresso/10 hover:border-gold/40 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{item.emoji}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-playfair text-espresso font-medium leading-snug group-hover:text-brown-mid transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-espresso/50 text-xs mt-1 font-light">
                    {activeTab}
                  </p>
                </div>
                <div className="font-cormorant text-gold font-semibold text-base whitespace-nowrap">
                  {fmt(item.price)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 reveal">
          <a
            href="/#/pos"
            className="inline-block px-8 py-3 bg-espresso text-cream rounded font-medium text-sm hover:bg-brown-mid transition-colors"
          >
            Pesan Sekarang →
          </a>
        </div>
      </div>
    </section>
  )
}
