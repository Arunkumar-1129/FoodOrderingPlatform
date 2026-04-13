/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#C5F135',
          dark:    '#a8cc2a',
          light:   '#d8ff5a',
        },
        surface: {
          DEFAULT: '#111111',
          card:    '#1C1C1C',
          elevated:'#242424',
          border:  '#2E2E2E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
