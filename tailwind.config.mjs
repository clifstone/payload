import containerQueries from '@tailwindcss/container-queries'

const breakpoints = {
  '2xsmall': '320px',
  xsmall: '375px',
  small: '667px',
  medium: '768px',
  large: '1024px',
  xlarge: '1366px',
  '2xlarge': '1511px',
  '3xlarge': '1920px',
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: breakpoints,
      maxWidth: {
        default: '1366px',
        ...breakpoints,
      },
    },
  },
  plugins: [containerQueries],
}
