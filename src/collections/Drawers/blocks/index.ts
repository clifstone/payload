import type { ComponentType } from 'react'
//import LogoBlock from './logoBlock'
import MenuReference from './menuReference'

export const Blocks = {
  // logo: LogoBlock,
  menuReference: MenuReference,
} satisfies Record<string, ComponentType<any>>
