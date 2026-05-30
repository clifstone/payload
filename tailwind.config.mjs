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

const colorNames = ['primary', 'secondary', 'tertiary', 'quaternary', 'quinary']

const lightnessScale = {
  50: '95%',
  100: '90%',
  200: '80%',
  300: '70%',
  400: '60%',
  500: '50%',
  600: '40%',
  700: '30%',
  800: '20%',
  900: '10%',
  950: '5%',
}

const colorValue = (value) => {
  return ({ opacityValue }) =>
    opacityValue === undefined ? value : value.replace('/ 1)', `/ ${opacityValue})`)
}

const makeColorScale = (name) => ({
  DEFAULT: ({ opacityValue }) =>
    opacityValue === undefined
      ? `var(--${name})`
      : `hsl(from var(--${name}) h s l / ${opacityValue})`,

  ...Object.fromEntries(
    Object.entries(lightnessScale).map(([step, lightness]) => [
      step,
      colorValue(`hsl(from var(--${name}) h s ${lightness} / 1)`),
    ]),
  ),
})

const colors = Object.fromEntries(colorNames.map((name) => [name, makeColorScale(name)]))

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
      colors,
    },
  },
  plugins: [containerQueries],
}
