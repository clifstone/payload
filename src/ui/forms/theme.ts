export const Theme = {
  wrapper: {
    base: 'w-full isolate border',
  },
  input: {
    base: 'w-full ring-hidden outline-hidden',
    sizes: {
      tiny: 'text-xs px-4 py-3',
      small: 'text-sm px-4 py-3',
      medium: 'text-base px-5 py-3',
      large: 'text-lg px-5 py-4',
    },
    shapes: {
      round: 'rounded-full',
      rounded: 'rounded-lg',
      square: 'rounded-none',
    },
  },
  label: {
    base: 'absolute left-4 top-0 -translate-y-1/2 z-10 px-1 uppercase font-bold bg-background',
    sizes: {
      tiny: 'text-[0.6rem]',
      small: 'text-[0.7rem]',
      medium: 'text-[0.7rem]',
      large: 'text-[0.7rem] tracking-[2px]',
    },
  },
  variants: {
    transparent: {
      input: 'bg-transparent',
      label: 'color-red-500',
    },
  },
}
