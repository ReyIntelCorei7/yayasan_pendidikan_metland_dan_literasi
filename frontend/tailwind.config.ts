import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-primary',
    'text-primary',
    'border-primary',
    'bg-primary/10',
    'bg-primary/20',
    'text-primary/60',
    'border-primary/30',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#EFF8FF',
          100: '#D1EBFC',
          200: '#A8D4F0',
          300: '#72B8E4',
          400: '#4A9FD6',
          500: '#3D8ABF',
          600: '#2E6F9E',
          700: '#245A82',
          800: '#1B4567',
          900: '#132F4A',
          DEFAULT: '#3D8ABF',
        },
        secondary: {
          50:  '#FFF9EB',
          100: '#FFF0CC',
          200: '#FFE099',
          300: '#FFD066',
          400: '#F5B731',
          500: '#E5A320',
          DEFAULT: '#E5A320',
        },
        accent: {
          50:  '#ECFDF5',
          100: '#D1FAE5',
          300: '#6EE7B7',
          500: '#10B981',
          700: '#047857',
          DEFAULT: '#10B981',
        },
        charcoal: {
          DEFAULT: '#111111',
          soft: '#1A1A1A',
          700: '#2D2D2D',
          600: '#404040',
        },
        offwhite: '#FAFAF8',
        surface: {
          DEFAULT: '#FCFCFC',
          warm: '#FAF8F5',
          cool: '#F0F6FB',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        '7xl': ['5rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        'marquee-reverse': 'marquee-reverse 28s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-slower': 'float-slower 10s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'float-slower': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
