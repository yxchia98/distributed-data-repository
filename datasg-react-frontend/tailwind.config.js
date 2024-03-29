/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
        "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
    ],
    theme: {
        extend: {},
    },
    plugins: [require("@headlessui/tailwindcss"), require("@tailwindcss/forms")],
};
