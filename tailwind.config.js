/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./popup/*.{html, js}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px"
    },
    extend: {
      colors: {
        aquaBlue: "rgb(77, 159, 235)"
      }
    },
  },
  plugins: [],
}
