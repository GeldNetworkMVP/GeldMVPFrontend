/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        'brand-dark-green': "var(--brand-dark-green)",
        'brand-yellow': "var(--brand-yellow)",
        'brand-light-green': "var(--brand-light-green)",
        'brand-light-gray': "var(--brand-light-gray)",
        'brand-gray': "var(--brand-gray)",
      },
    },
  },
  plugins: [],
};
