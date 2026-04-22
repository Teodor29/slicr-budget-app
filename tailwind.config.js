/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600 — main buttons, active nav
          hover:   '#1d4ed8', // blue-700 — hover/active state
          light:   '#eff6ff', // blue-50  — subtle backgrounds
          text:    '#2563eb', // same as DEFAULT, used on text
        },
        danger: {
          DEFAULT: '#ef4444', // red-500 — overspent, delete
          light:   '#fef2f2', // red-50
        },
        surface: '#ffffff',   // card backgrounds
        page:    '#f9fafb',   // app background (gray-50)
        border:  '#e5e7eb',   // gray-200 — inputs, dividers
        muted:   '#9ca3af',   // gray-400 — placeholder text
      },
      borderRadius: {
        card:  '1rem',   // rounded-2xl — cards
        input: '0.75rem', // rounded-xl — inputs, buttons
      },
    },
  },
  plugins: [],
}
