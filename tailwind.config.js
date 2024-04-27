const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  mode: "jit",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    colors: {
      // Build your palette here
      transparent: "transparent",
      current: "currentColor",
      gray: colors.neutral,
      red: colors.red,
      blue: colors.sky,
      yellow: colors.yellow,
      purple: colors.violet,
      green: colors.lime,
    },
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      transitionProperty: {
        bg: "background-color",
      },
    },
  },
  plugins: [],
};
