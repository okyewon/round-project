/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      mobile: "640px",
      tablet: "920px",
      desktop: "1000px",
    },
    container: {
      center: true,
    },
  },
  plugins: [require("daisyui")],
};
