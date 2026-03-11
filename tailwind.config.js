/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lab: {
          bg: '#f0f4f8',
          surface: '#ffffff',
          border: '#c5d4e4',
          accent: '#4a90d9',
          accentDark: '#2c6bb5',
          muted: '#6b7c8f',
          success: '#2e8b57',
          error: '#c23a3a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
