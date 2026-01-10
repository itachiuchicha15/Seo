/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: 'var(--color-primary)',
                    foreground: 'var(--color-primary-foreground)',
                },
                secondary: {
                    DEFAULT: 'var(--color-secondary)',
                    foreground: 'var(--color-secondary-foreground)',
                },
                dark: 'var(--color-dark)',
                light: 'var(--color-light)',
                muted: 'var(--color-muted)',
                chart: 'var(--color-chart)',
            },
        },
    },
    plugins: [],
}
