/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily:{
      'title': ["'Bebas Neue', sans-serif"]
    },
    extend: {
       width:{
        '500':'500px'
       },
       screens:{
        "sm":"500px"
       }
    },
  },
  plugins: [],
};
