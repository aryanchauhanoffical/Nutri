/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'green-primary': '#3a7d44',
        'green-light': '#e8f5ea',
        'green-dark': '#2d6235',
        cream: '#faf8f4',
        coral: '#e8704a',
        'coral-light': '#fdf0ea',
        'indigo-accent': '#6366f1',
        'indigo-light': '#eef2ff',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '16px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.09)',
      },
    },
  },
  plugins: [],
}

