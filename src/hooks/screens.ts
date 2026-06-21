import { useMediaQuery } from 'react-responsive'

export const useScreens = () => {
  return {
    xxsmall: useMediaQuery({ minWidth: 320 }),
    xsmall: useMediaQuery({ minWidth: 375 }),
    small: useMediaQuery({ minWidth: 667 }),
    medium: useMediaQuery({ minWidth: 768 }),
    large: useMediaQuery({ minWidth: 1024 }),
    xlarge: useMediaQuery({ minWidth: 1366 }),
    xxlarge: useMediaQuery({ minWidth: 1446 }),
    xxxlarge: useMediaQuery({ minWidth: 1920 }),
    portrait: useMediaQuery({ orientation: 'portrait' }),
  }
}
