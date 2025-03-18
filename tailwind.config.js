/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx}',
      './src/components/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f8f9fa',
            100: '#e9ecef',
            200: '#dee2e6',
            300: '#ced4da',
            400: '#adb5bd',
            500: '#6c757d',
            600: '#495057',
            700: '#343a40',
            800: '#212529',
            900: '#121212',
          },
          accent: {
            light: '#e2d8c6',
            DEFAULT: '#9d8c70',
            dark: '#695c4a',
          },
        },
        fontFamily: {
          serif: ['Baskerville', 'Georgia', 'Times New Roman', 'serif'],
          sans: ['Helvetica Neue', 'Arial', 'sans-serif'],
        },
        typography: {
          DEFAULT: {
            css: {
              'blockquote p:first-of-type::before': false,
              'blockquote p:last-of-type::after': false,
            },
          },
        },
      },
    },
    plugins: [require('@tailwindcss/typography')],
  }