import { ReactNode } from 'react'
import { DrawerProvider } from './drawers'

interface ContextsProps {
  children: ReactNode
}

const Contexts = ({ children }: ContextsProps) => {
  return <DrawerProvider>{children}</DrawerProvider>
}

export default Contexts
