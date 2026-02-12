/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    blue: "#0F4C81", // Deep Blue
                    yellow: "#FACC15", // Bright Yellow
                    white: "#FFFFFF",
                }
            }
        },
    },
    plugins: [],
}
