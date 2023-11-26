/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        bebas: ["Bebas Neue", "sans-serif"],
        nova: ["Nova Square", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        smooch: ["Smooch Sans", "sans-serif"],
        teko: ["Teko", "sans-serif"],
      },
      fontWeight: {
        "weight-100": 100,
        "weight-200": 200,
        "weight-300": 300,
        "weight-400": 400,
        "weight-500": 500,
        "weight-600": 600,
        "weight-700": 700,
        "weight-800": 800,
        "weight-900": 900,
      },
      backgroundColor: {
        theme1: "#08080A",
        theme2: "#1F2128",
        theme3: "#2C3038",
      },
    },
  },
  plugins: [],
};
