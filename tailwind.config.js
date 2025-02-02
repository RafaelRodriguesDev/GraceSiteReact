/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};

module.exports = {
  theme: {
    extend: {
      gridTemplateColumns: {
        '4': 'repeat(4, minmax(0, 1fr))',
      },
      gridTemplateRows: {
        '4': 'repeat(4, minmax(0, 1fr))',
      },
    }
  }
}