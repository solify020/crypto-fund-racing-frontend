/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-black': '#000000',
        'primary-white': '#ffffff',
        'accent-red': '#ffffff',
        'accent-red-dark': '#000000',
        'white': '#ffffff',
        'black': '#000000',
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'sm': '0 2px 4px 0 rgba(255, 255, 255, 0.2)',
        'md': '0 4px 8px -2px rgba(255, 255, 255, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.5)',
        'lg': '0 10px 20px -3px rgba(255, 255, 255, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
        'xl': '0 25px 30px -5px rgba(255, 255, 255, 0.15), 0 10px 15px -5px rgba(0, 0, 0, 0.5)',
      },
      transitionDuration: {
        'fast': '0.15s',
        'normal': '0.3s',
        'slow': '0.5s',
      },
      fontFamily: {
        'inter': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}