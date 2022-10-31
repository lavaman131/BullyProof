/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./popup/*.{html, js}", "./options/*.{html, js}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      colors: {
        aquaBlue: "rgb(77, 159, 235)",
        midnightBlue: "rgb(17, 23, 41)",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
