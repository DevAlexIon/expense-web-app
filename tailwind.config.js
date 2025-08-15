/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        green: '#00A53D',
        red: '#E7000B',
      },
    },
    fontFamily: {
      poppins: ['Poppins'],
    },
    extend: {
      colors: {
        'accent-2': 'var(--accent-2)',
      },
      // animation: {
      //   pulse: 'pulse 2s infinite',
      //   moving: 'move 3s linear infinite',
      //   'slide-right': 'slide-right 2s linear infinite',
      // },
      // keyframes: {
      //   pulse: {
      //     '0%, 100%': { opacity: 0.5 },
      //     '50%': { opacity: 1 },
      //     'slide-right': {
      //       '0%': { transform: 'translateX(-100%)' },
      //       '100%': { transform: 'translateX(100%)' },
      //     },
      //   },
      //   move: {
      //     '0%': { transform: 'translateX(-100%)' },
      //     '100%': { transform: 'translateX(100%)' },
      //   },
      // },
      // TODO: Modify spacing, borderRadius, boxShadow with designer's values
      fontSize: {
        xs: ['10px', { lineHeight: '9px' }],
        sm: ['12px', { lineHeight: '18px' }],
        md: ['14px', { lineHeight: '21px' }],
        lg: ['18px', { lineHeight: '27px' }],
        xl: ['24px', { lineHeight: '36px' }],
        '2xl': ['32px', { lineHeight: '48px' }],
      },
      spacing: {
        'container-padding-mobile': 'var(--spacing-4)',
        'container-padding-desktop': 'var(--spacing-8)',
        'container-max-width-desktop': 'var(--spacing-320)',
        'width-xxs': 'var(--spacing-80)',
        'width-xs': 'var(--spacing-96)',
        'width-sm': 'var(--spacing-120)',
        'width-md': 'var(--spacing-140)',
        'width-lg': 'var(--spacing-160)',
        'paragraph-max-width': 'var(--spacing-180)',
        'width-xl': 'var(--spacing-192)',
        'width-2xl': 'var(--spacing-256)',
        'width-3xl': 'var(--spacing-320)',
        'width-4xl': 'var(--spacing-360)',
        'width-5xl': 'var(--spacing-400)',
        'width-6xl': 'var(--spacing-480)',

        'spacing-none': 'var(--spacing-0)', // 0px
        'spacing-xxs': 'var(--spacing-0\\.5)', // 2px
        'spacing-xs': 'var(--spacing-1)', // 4px
        'spacing-sm': 'var(--spacing-1\\.5)', // 6px
        'spacing-md': 'var(--spacing-2)', // 8px

        'spacing-lg': 'var(--spacing-3)', // 12px
        'spacing-xl': 'var(--spacing-3\\.5)', // 14px
        'spacing-2xl': 'var(--spacing-4)', // 16px

        'spacing-3xl': 'var(--spacing-5)', // 20px
        'spacing-4xl': 'var(--spacing-6)', // 24px

        'spacing-5xl': 'var(--spacing-8)', // 32px

        'spacing-6xl': 'var(--spacing-10)', // 40px
        'spacing-7xl': 'var(--spacing-12)', // 48px

        'spacing-8xl': 'var(--spacing-14)', // 56px

        'spacing-9xl': 'var(--spacing-16)', // 64px

        'spacing-10xl': 'var(--spacing-20)',
        'spacing-11xl': 'var(--spacing-24)',
        'spacing-12xl': 'var(--spacing-32)',
        'spacing-13xl': 'var(--spacing-40)',
      },
      borderRadius: {
        'radius-none': '0px',
        'radius-xxs': '2px',
        'radius-xs': '4px',
        'radius-sm': '6px',
        'radius-md': '8px',
        'radius-lg': '10px',
        'radius-xl': '12px',
        'radius-2xl': '16px',
        'radius-3xl': '20px',
        'radius-4xl': '24px',
        'radius-5xl': '32px',
        'radius-6xl': '80px',
        'radius-7xl': '90px',
        'radius-full': '9999px',
      },
      boxShadow: {
        'shadow-1': '0px 24px 48px 0px var(--shadow)',
        'shadow-2': '0px 24px 68px 0px var(--shadow)',
        'shadow-3': '0px 0px 68px 0px var(--shadow)',
        'shadow-1-light': '0px 24px 48px 0px var(--shadow-light)',
        'shadow-2-light': '0px 24px 68px 0px var(--shadow-light)',
        'shadow-3-light': '0px 0px 68px 0px var(--shadow-light)',
      },
    },
  },
  plugins: [
    plugin(({ addBase, addUtilities }) => {
      addUtilities({
        '.svg-dark-stroke': {
          '& path': {
            stroke: '#F0F0F0',
          },
          '& rect': {
            stroke: '#F0F0F0',
          },
          '& circle': {
            stroke: '#F0F0F0',
          },
          '& ellipse': {
            stroke: '#F0F0F0',
          },
        },
        '.svg-dark-path': {
          '& path': {
            path: '#F0F0F0',
            fill: '#F0F0F0',
          },
        },
        '.svg-light-stroke': {
          '& path': {
            stroke: '#1E384B',
          },
          '& rect': {
            stroke: '#1E384B',
          },
          '& circle': {
            stroke: '#1E384B',
          },
          '& ellipse': {
            stroke: '#1E384B',
          },
        },
        '.svg-light-path': {
          '& path': {
            path: '#1E384B',
            fill: '#1E384B',
          },
        },

        // PRIMARY COLOR
        '.svg-path-primary': {
          '& path': {
            path: '#F0F0F0',
            stroke: '#F0F0F0',
          },
        },
        '.svg-path-primary-light': {
          '& path': {
            path: '#1E384B',
            stroke: '#1E384B',
          },
        },
        // SECONDARY COLOR
        '.svg-path-secondary': {
          '& path': {
            path: '#232323',
            stroke: '#232323',
          },
        },
        '.svg-path-secondary-light': {
          '& path': {
            path: '#FFFFFF',
            stroke: '#FFFFFF',
          },
        },
      })
      addBase({
        ':root': {
          '--shadow': '#121212',
          '--shadow-light': '#F0F0F0',
          '--spacing-0': '0px',
          '--spacing-0\\.5': '2px',
          '--spacing-1': '4px',
          '--spacing-1\\.5': '6px',
          '--spacing-2': '8px',
          '--spacing-3': '12px',
          '--spacing-3\\.5': '14px',
          '--spacing-4': '16px',
          '--spacing-5': '20px',
          '--spacing-6': '24px',
          '--spacing-8': '32px',
          '--spacing-10': '40px',
          '--spacing-12': '48px',
          '--spacing-14': '56px',
          '--spacing-16': '64px',
          '--spacing-20': '80px',
          '--spacing-24': '96px',
          '--spacing-32': '128px',
          '--spacing-40': '160px',
          '--spacing-48': '192px',
          '--spacing-56': '224px',
          '--spacing-64': '256px',
          '--spacing-80': '320px',
          '--spacing-96': '384px',
          '--spacing-120': '480px',
          '--spacing-140': '560px',
          '--spacing-160': '640px',
          '--spacing-180': '720px',
          '--spacing-192': '768px',
          '--spacing-256': '1024px',
          '--spacing-320': '1280px',
          '--spacing-360': '1440px',
          '--spacing-400': '1600px',
          '--spacing-480': '1920px',
          '--accent-2': '#5e3baf',
        },
        ":root[class~='dark']": {
          '--accent-2': '#B899FF',
        },
      })
    }),
  ],
  safelist: [
    {
      pattern: /.*/,
    },
  ],
}
