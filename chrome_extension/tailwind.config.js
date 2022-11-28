/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./popup/*.{html, js}", "./options/*.{html, js}", './*.{html, js}'],
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
        midnightBlue: "#2B3E5B",
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
