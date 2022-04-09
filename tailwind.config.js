module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      jua: ["Jua", "sans-serif"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
  // darkMode: "class",
};
