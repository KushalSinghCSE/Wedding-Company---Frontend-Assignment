/** tailwind.config.cjs */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'card-lg': '0 30px 60px rgba(6,40,60,0.08)',
      }
    },
  },
  plugins: [],
}
