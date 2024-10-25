/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    function ({ addVariant }) {
      addVariant("children", "& > *");
    },
    require("flowbite/plugin"),
    require("@tailwindcss/typography")
  ],
};
