/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        sm: '0.8rem',
        base: '1rem',
        xl: '1.25rem',
        '2xl': '1.563rem',
        '3xl': '1.953rem',
        '4xl': '2.441rem',
        '5xl': '3.052rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],       // Override or extend default sans font
        heading: ['Roboto', 'sans-serif'],   // Custom font for headings
        display: ['Oswald', 'sans-serif'],   // Custom font for display text
        handwriting: ['Pacifico', 'cursive'],// Custom font for cursive or handwriting styles
      },
    },
  },
  plugins: [],
}

