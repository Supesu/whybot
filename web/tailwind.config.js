const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.tsx", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        background: "#EEEFF2",
        foreground: "#2D2D2D",
        accent: "#EFEAFA",
      },
      placeholderColor: {
        custom: "D0D0D1"
      }
    },
  },
  plugins: [],
};
