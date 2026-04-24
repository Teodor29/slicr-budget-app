/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover:   'var(--color-primary-hover)',
          light:   'var(--color-primary-light)',
          text:    'var(--color-primary)',
        },
        danger: {
          DEFAULT: 'var(--color-danger)',
          light:   'var(--color-danger-light)',
        },
        surface: 'var(--color-surface)',
        page:    'var(--color-page)',
        border:  'var(--color-border)',
        muted:   'var(--color-muted)',
        fg: {
          DEFAULT:   'var(--color-fg)',
          secondary: 'var(--color-fg-secondary)',
          subtle:    'var(--color-fg-subtle)',
        },
        hover:   'var(--color-hover)',
        track:   'var(--color-track)',
      },
      borderRadius: {
        card:  '1rem',
        input: '0.75rem',
      },
    },
  },
  plugins: [],
}
