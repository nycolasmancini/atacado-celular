/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'montserrat': ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        'bebas': ['var(--font-bebas-neue)', 'cursive'],
      },
      colors: {
        primary: {
          green: '#00b894',
          'green-dark': '#00866a',
          blue: '#2E86AB',
          red: '#ee5a6f',
          orange: '#FF6B35',
        },
        'primary-orange': '#FF6B35',
        'primary-blue': '#2E86AB',
        'primary-green': '#58A55C',
        success: '#58A55C',
        danger: '#FF4444',
        gray: {
          text: '#555555',
          light: '#F8F9FA',
        },
        black: '#1a1a1a',
      },
      fontSize: {
        '12px': ['12px', { lineHeight: '1.4' }],
        '14px': ['14px', { lineHeight: '1.4' }],
        '16px': ['16px', { lineHeight: '1.5' }],
        '18px': ['18px', { lineHeight: '1.5' }],
        '20px': ['20px', { lineHeight: '1.4' }],
        '24px': ['24px', { lineHeight: '1.3' }],
        '32px': ['32px', { lineHeight: '1.2' }],
        '40px': ['40px', { lineHeight: '1.2' }],
        '56px': ['56px', { lineHeight: '1.1' }],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1.25rem', // 20px
          md: '2.5rem', // 40px
        },
        screens: {
          DEFAULT: '1200px',
        },
      },
      animation: {
        'pulse-scale': 'pulse-scale 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
      },
      scale: {
        '102': '1.02',
      },
      keyframes: {
        'pulse-scale': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'fade-in-up': {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.btn-interactive': {
          '@apply transition-all duration-300 ease-out transform-gpu': {},
        },
        '.btn-interactive:hover': {
          '@apply scale-105': {},
        },
        '.btn-interactive:active': {
          '@apply scale-95': {},
        },
        '.btn-primary-interactive': {
          '@apply btn-interactive bg-primary-orange text-white font-semibold py-3 px-6 rounded-full shadow-lg': {},
        },
        '.btn-primary-interactive:hover': {
          '@apply bg-orange-600 shadow-xl': {},
        },
        '.btn-secondary-interactive': {
          '@apply btn-interactive border-2 border-primary-orange text-primary-orange font-semibold py-3 px-6 rounded-full': {},
        },
        '.btn-secondary-interactive:hover': {
          '@apply bg-primary-orange text-white shadow-lg': {},
        },
        '.card-interactive': {
          '@apply transition-all duration-500 ease-out transform-gpu': {},
        },
        '.card-interactive:hover': {
          '@apply shadow-2xl -translate-y-2': {},
          'box-shadow': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        },
        '.card-glow:hover': {
          '@apply shadow-2xl': {},
          'box-shadow': '0 25px 50px -12px rgba(255, 107, 53, 0.25)',
        },
        '.link-animated': {
          '@apply relative inline-block transition-colors duration-300': {},
        },
        '.link-animated::after': {
          'content': '""',
          'position': 'absolute',
          'width': '0',
          'height': '2px',
          'bottom': '-2px',
          'left': '0',
          'background': 'linear-gradient(90deg, #FF6B35, #58A55C)',
          'transition': 'width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        },
        '.link-animated:hover::after': {
          'width': '100%',
        },
        '.link-animated:hover': {
          '@apply text-primary-orange': {},
        },
        '.shadow-soft': {
          'box-shadow': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        '.shadow-medium': {
          'box-shadow': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        '.shadow-strong': {
          'box-shadow': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        '.focus-ring': {
          '@apply focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-offset-2 focus:ring-offset-white': {},
        },
      })
    }
  ],
}