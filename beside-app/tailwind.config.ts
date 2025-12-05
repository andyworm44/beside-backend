import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F5',
          100: '#FFE5E5',
          200: '#FFE0E0',
          300: '#FFB6B6',
          400: '#FF8E8E',
          500: '#FF6B6B',
          600: '#FF5252',
          700: '#E53E3E',
          800: '#C53030',
          900: '#9B2C2C',
        },
        secondary: {
          50: '#E8F8F5',
          100: '#D1F2EB',
          200: '#A3E4D7',
          300: '#76D7C4',
          400: '#4ECDC4',
          500: '#44A08D',
          600: '#3D8B7A',
          700: '#357667',
          800: '#2E6154',
          900: '#264C41',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-soft': 'pulse 2s infinite',
        'bounce-soft': 'bounce 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0,0,0,0.08)',
        'strong': '0 20px 60px rgba(0,0,0,0.15)',
        'pink': '0 8px 20px rgba(255, 107, 107, 0.4)',
        'teal': '0 8px 20px rgba(78, 205, 196, 0.4)',
      },
      borderRadius: {
        'xl': '20px',
        '2xl': '25px',
        '3xl': '30px',
      }
    },
  },
  plugins: [],
}

export default config


