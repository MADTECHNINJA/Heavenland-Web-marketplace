module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        fontFamily: {
            sans: ['Montserrat', 'sans-serif'],
            courier: ['Courier', 'sans-serif'],
        },
        screens: {
            xs: '514px',
            sm: '640px',
            md: '768px',
            xlg: '896px',
            lg: '1024px',
            xxl: '1152px',
            xl: '1280px',
            '2xl': '1536px',
            '3xl': '2500px',
        },
        extend: {
            lineHeight: {
                5.5: '1.375rem',
                4.5: '1.125rem',
            },
            height: {
                0.75: '0.1875rem',
            },
            colors: {
                primary: '#2e25d7',
                secondary: '#0ea0e1',
                'indigo-950': '#030318',
                'indigo-940': '#040423',
                'indigo-930': '#001540',
                'indigo-920': '#161655',
            },
            keyframes: {
                open: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 100 },
                },
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
};
