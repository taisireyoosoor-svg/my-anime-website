import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#09090b',
        surface: '#141414',
        panel: '#1c1c1f',
        ember: '#e50914'
      },
      fontFamily: { sans: ['var(--font-inter)', 'Arial', 'sans-serif'] },
      boxShadow: { glow: '0 0 40px rgba(229, 9, 20, .2)' }
    }
  },
  plugins: []
};

export default config;
