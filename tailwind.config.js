/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        page:    'var(--page)',
        surface: 'var(--surface)',
        subtle:  'var(--subtle)',
        border:  'var(--border)',
        fg: {
          DEFAULT: 'var(--text)',
          muted:   'var(--text-muted)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover:   'var(--primary-hover)',
        },
        danger:  'var(--danger)',
      },
      borderRadius: {
        card:  '1rem',
        input: '0.75rem',
      },
    },
  },
  plugins: [],
}
