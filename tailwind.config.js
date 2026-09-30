/** Minimal black-and-white design tokens. Grays are ink at reduced strength, used only for
 * hierarchy (borders, secondary text, hover), never as accent colours. */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      padding: "2rem",
      center: true,
    },
    extend: {
      screens: {
        // Touch sizing: phones by width, plus any coarse pointer (tablets). Use as `touch:h-11`.
        touch: { raw: '(pointer: coarse), (max-width: 767.98px)' },
      },
      colors: {
        ink: { DEFAULT: '#0A0A0A', 700: '#3F3F46', 500: '#71717A', 300: '#D4D4D8', 200: '#E4E4E7', 100: '#F4F4F5', 50: '#FAFAFA' },
        paper: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        // Legacy names kept so untouched markup keeps rendering during the migration.
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Inter', 'sans-serif'],
        roboto: ['Inter', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        panel: '0 1px 2px rgba(10,10,10,0.04), 0 0 0 1px rgba(10,10,10,0.06)',
        pop: '0 8px 24px rgba(10,10,10,0.12), 0 0 0 1px rgba(10,10,10,0.08)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
