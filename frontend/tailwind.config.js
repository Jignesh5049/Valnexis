/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#08101A',
        panel: '#111F2D',
        accent: '#1EC5A7',
        danger: '#E74C3C',
        warning: '#F39C12',
        success: '#2ECC71'
      },
      fontFamily: {
        sans: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        neon: '0 0 24px rgba(30, 197, 167, 0.25)'
      }
    }
  },
  plugins: []
};
