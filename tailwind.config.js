/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#e74c3c',
                secondary: '#3498db',
                dark: '#2c3e50',
                light: '#ecf0f1',
            }
        },
    },
    plugins: [],
}
