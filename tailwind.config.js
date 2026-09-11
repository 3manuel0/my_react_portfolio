/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        os: {
          bg: "#0b0e14",
          surface: "#11151f",
          surface2: "#161b27",
          border: "#2a3142",
          border2: "#3a4256",
          text: "#c8d1e0",
          dim: "#78829a",
          accent: "#5eead4",
          accent2: "#4dd0b8",
          blue: "#7aa2f7",
          green: "#9ece6a",
          yellow: "#e0af68",
          red: "#f7768e",
          purple: "#bb9af7",
          cyan: "#7dcfff",
        },
      },
      fontFamily: {
        mono: ["robotMono", "monospace"],
        arcade: ["arcade-bold", "sans-serif"],
      },
    },
  },
  plugins: [],
};