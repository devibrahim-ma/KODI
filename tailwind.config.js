/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        samu: {
          navy: {
            950: '#060d1e',
            900: '#0b1736',
            850: '#0f2048',
            800: '#142a5c',
            700: '#1b3775',
            600: '#204391',
            500: '#2b54b2',
          },
          red: {
            700: '#8e1732',
            600: '#a81c3c',
            500: '#c0264b', // Carmesí oficial SAMU
            400: '#d93a5e',
            300: '#eb6280',
          }
        }
      }
    },
  },
  plugins: [],
}
