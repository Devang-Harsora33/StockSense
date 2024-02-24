/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        urbanist: ["urbanist", "sans-serif"],
      },
      colors: {
        emerald_green: "#25BDB0",
        dark_emerald_green: "#16786f",
        "light-white": "rgba(255,255,255,0.17)",
      },
    },
  },
  plugins: [],
};
