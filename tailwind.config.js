// tailwind.config.js
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "hsl(var(--accent))",
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#450a0a',
          950: '#2d0a0a',
        },
        surface: {
          light: '#f8f9fa',
          dark: '#000000',
        }
      },
      gridTemplateColumns: {
      25: 'auto repeat(24, minmax(0, 1fr))'
    }
    },
  },
  plugins: [],
}
