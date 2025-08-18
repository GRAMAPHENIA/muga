/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        dark: '#191717',
        light: '#ffffff',
        accent: '#ff5353',
        'text-muted': '#D9D9D9'
      },
      fontFamily: {
        heading: ['PT Serif', 'serif'],
        body: ['Poppins', 'sans-serif']
      },
      fontSize: {
        'title': '30px'
      },
      spacing: {
        'standard': '20px',
        'small': '10px'
      },
      gridTemplateColumns: {
        'dark': '40% 60%',
        'light': '60% 40%'
      },
      screens: {
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1279px'},
        'desktop': '1280px'
      },
    },
  },
  plugins: [],
}