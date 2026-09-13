/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        solar: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706"
        }
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [],
};
