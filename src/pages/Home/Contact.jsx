import { useState } from 'react'

const contactItems = [
  {
    icon: '📍',
    label: 'Alamat',
    value: 'Ruko Jl. Festive Garden, Jl. Grand Wisata No.83, Lambangsari, Kec. Tambun Sel., Kabupaten Bekasi, Jawa Barat 17510',
  },
  {
    icon: '🕐',
    label: 'Jam Buka',
    value: 'Senin–Jumat: 08.00–22.00\nSabtu–Minggu: 08.00–23.00',
  },
  {
    icon: '📸',
    label: 'Instagram',
    value: '@rohah.cafe',
  },
]

const purposes = [
  'Reservasi Meja',
  'Pertanyaan Menu',
  'Kerjasama / Partnership',
  'Feedback',
  'Lainnya',
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', purpose: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section id="contact" className="bg-cream py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 reveal">
          <p className="font-cormorant italic text-brown-mid tracking-widest text-sm mb-3">
            — Hubungi Kami
          </p>
          <h2 className="font-playfair text-4xl lg:text-5xl text-espresso">
            <em className="text-gold">Temukan</em> Kami
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 reveal">
          {/* Left: contact info + map */}
          <div>
            <div className="space-y-6 mb-8">
              {contactItems.map((c) => (
                <div key={c.label} className="flex gap-4">
                  <div className="text-2xl flex-shrink-0">{c.icon}</div>
                  <div>
                    <div className="font-cormorant text-brown-mid text-xs uppercase tracking-widest mb-1">{c.label}</div>
                    <div className="text-espresso text-sm font-light leading-relaxed whitespace-pre-line">{c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps iframe */}
            <div className="rounded-xl overflow-hidden border border-espresso/10 h-60">
              <iframe
                title="ROHAH Cafe Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.0!2d107.0!3d-6.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTgnMDAuMCJTIDEwN8KwMDAnMDAuMCJF!5e0!3m2!1sid!2sid!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-cormorant text-xs uppercase tracking-widest text-brown-mid mb-1.5">Nama</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-espresso/15 bg-warm-white text-espresso text-sm focus:outline-none focus:border-gold transition-colors"
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label className="block font-cormorant text-xs uppercase tracking-widest text-brown-mid mb-1.5">No. HP</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-espresso/15 bg-warm-white text-espresso text-sm focus:outline-none focus:border-gold transition-colors"
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
            </div>

            <div>
              <label className="block font-cormorant text-xs uppercase tracking-widest text-brown-mid mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-espresso/15 bg-warm-white text-espresso text-sm focus:outline-none focus:border-gold transition-colors"
                placeholder="email@contoh.com"
              />
            </div>

            <div>
              <label className="block font-cormorant text-xs uppercase tracking-widest text-brown-mid mb-1.5">Keperluan</label>
              <select
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-espresso/15 bg-warm-white text-espresso text-sm focus:outline-none focus:border-gold transition-colors"
              >
                <option value="">Pilih keperluan...</option>
                {purposes.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-cormorant text-xs uppercase tracking-widest text-brown-mid mb-1.5">Pesan</label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-espresso/15 bg-warm-white text-espresso text-sm focus:outline-none focus:border-gold transition-colors resize-none"
                placeholder="Tulis pesan Anda..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-espresso text-cream font-medium rounded-lg hover:bg-brown-mid transition-colors text-sm"
            >
              {sent ? '✓ Pesan Terkirim!' : 'Kirim Pesan'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
