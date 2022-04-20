const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html"],
  theme: {
    colors: {
      black: "#000000",
      white: "#ffffff",
      orange: {
        100: "#fff7f0",
        200: "#ffd2ba",
        300: "#ffc497",
        500: "#dea747",
        700: "#b38845",
      },
      yellow: {
        300: "#ffe1a6",
        500: "#ffe1a6",
      },
      red: {
        500: "#ff4433",
      },
    },
    extend: {
      fontFamily: {
        sans: ["RocknRoll One", ...defaultTheme.fontFamily.sans],
        ipa: [...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
