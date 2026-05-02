/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Cafe Profile ──────────────────────────────────────────
        cream:        '#FAF6ED',   // Putih Gading  — latar belakang utama
        'cream-dark': '#EDE9DF',   // sedikit lebih gelap untuk section alt
        espresso:     '#3E4140',   // Abu-abu Tua   — teks gelap & section gelap
        'brown-mid':  '#8C6D51',   // Cokelat Kopi  — teks sekunder / aksen bingkai
        gold:         '#739191',   // Teal Utama    — judul, label, aksen
        'gold-light': '#9AADAD',   // Teal muda     — hover state
        'warm-white': '#FAF6ED',   // sama dengan cream untuk kartu

        // ── POS System (dark theme, aksen teal) ────────────────────
        'pos-bg':         '#111818',
        'pos-sidebar':    '#162020',
        'pos-card':       '#1c2a2a',
        'pos-card-hover': '#233232',
        'pos-border':     '#2e4242',
        'pos-green':      '#4caf7d',
        'pos-red':        '#e05050',
        'pos-orange':     '#e07830',
        'pos-blue':       '#5090e0',
      },
      fontFamily: {
        playfair:  ['"Playfair Display"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        sans:      ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
