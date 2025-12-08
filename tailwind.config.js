/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // We will handle class manually
    theme: {
        extend: {
            colors: {
                primary: 'rgb(var(--bg-primary) / <alpha-value>)',
                secondary: 'rgb(var(--bg-secondary) / <alpha-value>)',
                tertiary: 'rgb(var(--bg-tertiary) / <alpha-value>)',

                'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
                'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
                'text-tertiary': 'rgb(var(--text-tertiary) / <alpha-value>)',

                'border-primary': 'rgb(var(--border-primary) / <alpha-value>)',
                'border-secondary': 'rgb(var(--border-secondary) / <alpha-value>)',

                accent: 'rgb(var(--accent-primary) / <alpha-value>)',
                'accent-hover': 'rgb(var(--accent-hover) / <alpha-value>)',
                'accent-text': 'rgb(var(--accent-text) / <alpha-value>)',
            }
        },
    },
    plugins: [],
}
