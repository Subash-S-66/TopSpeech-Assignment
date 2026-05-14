/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#2563eb",
          600: "#1d4ed8",
        },
      },
      boxShadow: {
        card: "0 20px 45px -24px rgba(37, 99, 235, 0.45)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(140deg, #1d4ed8 0%, #06b6d4 45%, #22c55e 100%)",
      },
    },
  },
  plugins: [],
};
