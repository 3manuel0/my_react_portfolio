/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        os: {
          bg: "rgb(var(--os-bg) / <alpha-value>)",
          surface: "rgb(var(--os-surface) / <alpha-value>)",
          surface2: "rgb(var(--os-surface2) / <alpha-value>)",
          border: "rgb(var(--os-border) / <alpha-value>)",
          border2: "rgb(var(--os-border2) / <alpha-value>)",
          text: "rgb(var(--os-text) / <alpha-value>)",
          dim: "rgb(var(--os-dim) / <alpha-value>)",
          accent: "rgb(var(--os-accent) / <alpha-value>)",
          accent2: "rgb(var(--os-accent2) / <alpha-value>)",
          blue: "rgb(var(--os-blue) / <alpha-value>)",
          green: "rgb(var(--os-green) / <alpha-value>)",
          yellow: "rgb(var(--os-yellow) / <alpha-value>)",
          red: "rgb(var(--os-red) / <alpha-value>)",
          purple: "rgb(var(--os-purple) / <alpha-value>)",
          cyan: "rgb(var(--os-cyan) / <alpha-value>)",
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