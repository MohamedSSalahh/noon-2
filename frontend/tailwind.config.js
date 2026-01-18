/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      colors: {
        noon: {
          yellow: 'var(--color-noon-yellow)',
          black: 'var(--color-noon-black)',
          blue: 'var(--color-noon-blue)',
          green: 'var(--color-system-green)',
          red: 'var(--color-system-red)',
          orange: 'var(--color-system-orange)',
          // Mapping grays to closest variables or generic grey variables
          gray: {
            50: 'var(--color-bg-support)', 
            100: 'var(--color-bg-tertiary)', 
            200: 'var(--color-body-light)', 
            400: 'var(--color-grey2)', 
            500: 'var(--color-grey1)',
            800: 'var(--color-noon-black)',
          }
        }
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
        'hover': '0 10px 25px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
