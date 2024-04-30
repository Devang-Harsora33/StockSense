/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        "dark-purple": "#0081CA",
        "light-white": "rgba(255,255,255,0.17)",
        "dark-blue": "#0d012b",
      },
    },
  },
  plugins: [],
};
