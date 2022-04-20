module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "bottom-up": {
          "0%": { transform: "translateY(100px)" },
          "100%": { transform: "translateY(0px)" },
        },
        "fade-in": {
          "0%": { opacity: 0.01 },
          "100%": { opacity: 1 },
        },
        "spin-y": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
      },
      animation: {
        "bottom-up": "bottom-up 0.4s linear",
        "fade-in": "fade-in 0.4s linear",
        "spin-y": "spin-y 2s ease-in-out infinite",
      },
    },
    fontFamily: {
      jua: ["Jua", "sans-serif"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
  // darkMode: "class",
};
