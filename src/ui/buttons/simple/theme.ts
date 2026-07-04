const speed = 'duration-150'

export type ButtonSize = 'tiny' | 'small' | 'medium' | 'large'
export type ButtonShape = 'square' | 'rounded' | 'round'
export type ButtonVariant = 'basic' | 'text' | 'outline' | 'solid' | 'translucent'
export type ButtonColor = 'plain' | 'primary' | 'dark'

interface SizeMap {
  buttonSize: Record<ButtonSize, string>
  iconSize: Record<ButtonSize, string>
}

interface ShapeMap {
  square: string
  rounded: string
  round: string
}

interface VariantConfig {
  base: string
  colors: Record<ButtonColor, string>
}

interface VariantsMap {
  basic: VariantConfig
  text: VariantConfig
  outline: VariantConfig
  solid: VariantConfig
  translucent: VariantConfig
}

interface Theme {
  base: string
  sizes: SizeMap
  shapes: ShapeMap
  variants: VariantsMap
}

export const Theme: Theme = {
  base: 'font-semibold leading-none inline-flex gap-1 items-center justify-center relative overflow-hidden isolate cursor-pointer',
  sizes: {
    buttonSize: {
      tiny: 'text-xs p-1',
      small: 'text-sm p-2',
      medium: 'p-2',
      large: 'text-lg p-3',
    },
    iconSize: {
      tiny: 'w-[16px]',
      small: 'w-[18px]',
      medium: 'w-[24px]',
      large: 'w-[32px]',
    },
  },
  shapes: {
    square: '',
    rounded: 'rounded-md',
    round: 'rounded-full',
  },
  variants: {
    basic: {
      base: `transition-all ${speed} ease-out border border-transparent`,
      colors: {
        plain: 'large:hover:bg-neutral-200 active:border-neutral-400',
        primary:
          'decoration-primary/[0.35] large:hover:decoration-primary large:hover:text-primary',
        dark: '', // Adding dark color for completeness
      },
    },
    text: {
      base: `underline underline-offset-1 decoration-2 decoration-solid transition-all ${speed} ease-out`,
      colors: {
        plain:
          'decoration-neutral-400 large:hover:decoration-neutral-500 active:decoration-neutral-400 active:text-neutral-400',
        primary:
          'text-primary decoration-primary/[0.35] large:hover:decoration-primary active:decoration-primary-400 active:text-neutral-400',
        dark: '', // Adding dark color for completeness
      },
    },
    outline: {
      base: `border transition-all ${speed} ease-out`,
      colors: {
        plain: 'large:hover:border-neutral-400 active:border-neutral-400 active:text-neutral-400',
        primary: 'large:hover:border-primary large:hover:text-primary',
        dark: 'border-white text-white large:hover:bg-white/10 large:hover:border-neutral-200 large:hover:text-neutral-200',
      },
    },
    solid: {
      base: `border border-transparent transition-all ${speed} ease-out`,
      colors: {
        plain: 'bg-neutral-200 large:hover:bg-neutral-300 active:border-neutral-400',
        primary: 'bg-primary text-white large:hover:bg-primary-700 active:border-white',
        dark: '', // Adding dark color for completeness
      },
    },
    translucent: {
      base: `border border-transparent transition-all ${speed} ease-out`,
      colors: {
        plain:
          'bg-neutral-200/50 large:hover:bg-neutral-300/80 active:border-neutral-400 active:text-neutral-600',
        primary:
          'bg-primary/50 text-white/80 hover:text-white/90 large:hover:bg-primary-700/80 active:border-white',
        dark: '', // Adding dark color for completeness
      },
    },
  },
}

// Export individual types for convenience
export const sizes: Theme['sizes'] = Theme.sizes
export const shapes: Theme['shapes'] = Theme.shapes
export const variants: Theme['variants'] = Theme.variants
