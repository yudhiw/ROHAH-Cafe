/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Cafe Profile colors
        cream: '#f5ede0',
        'cream-dark': '#ede0cc',
        espresso: '#1a1008',
        'brown-mid': '#5c3d20',
        gold: '#C8963E',
        'gold-light': '#e0b060',
        'warm-white': '#faf6f0',
        // POS colors
        'pos-bg': '#141008',
        'pos-sidebar': '#1e1610',
        'pos-card': '#221b10',
        'pos-card-hover': '#2a2214',
        'pos-border': '#3a2e1a',
        'pos-green': '#4caf7d',
        'pos-red': '#e05050',
        'pos-orange': '#e07830',
        'pos-blue': '#5090e0',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
