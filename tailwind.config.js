/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Roboto Mono"', 'monospace'],
        sans: ['"Roboto Mono"', 'monospace'],
      },
      colors: {
        desk: '#F7EFEA',
        notebook: '#FFFDF9',
        ruled: '#EAE0D5',
        marginCoral: '#F4A298',
        ink: {
          DEFAULT: '#4A403A',
          light: '#7A6E65',
          muted: '#9E9289',
        },
        pastel: {
          yellow: '#FFF3B0',
          green: '#D8E2DC',
          peach: '#FFE5D9',
          lavender: '#E8DFF5',
        },
      },
      boxShadow: {
        notebook: '0 12px 30px -4px rgba(74, 64, 58, 0.15), 0 6px 12px -3px rgba(74, 64, 58, 0.08)',
        sticky: '0 4px 6px -1px rgba(74, 64, 58, 0.1), 0 2px 4px -2px rgba(74, 64, 58, 0.06)',
      },
    },
  },
  plugins: [],
};
