import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7fd',
          300: '#a5bcfb',
          400: '#8196f8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          amber: '#f59e0b',
          rose:  '#f43f5e',
          cyan:  '#06b6d4',
          emerald: '#10b981',
          violet: '#8b5cf6',
        },
        surface: {
          DEFAULT: '#0f0f1a',
          1: '#141428',
          2: '#1a1a35',
          3: '#20204a',
          card: '#16162b',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body:    ['var(--font-body)', 'sans-serif'],
        mono:    ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'radial-gradient(ellipse at 0% 0%, #6366f115 0%, transparent 60%), radial-gradient(ellipse at 100% 100%, #8b5cf615 0%, transparent 60%), radial-gradient(ellipse at 50% 50%, #06b6d408 0%, transparent 80%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #6366f140, 0 0 20px #6366f120' },
          '100%': { boxShadow: '0 0 10px #6366f180, 0 0 40px #6366f140' },
        },
      },
      boxShadow: {
        'glow-sm':  '0 0 10px rgba(99, 102, 241, 0.3)',
        'glow':     '0 0 20px rgba(99, 102, 241, 0.4)',
        'glow-lg':  '0 0 40px rgba(99, 102, 241, 0.5)',
        'card':     '0 4px 24px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.2)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}

export default config
