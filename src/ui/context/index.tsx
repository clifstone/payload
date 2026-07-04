import { ReactNode } from 'react'
import { getDrawers } from '@/collections/Drawers/getDrawers'
import { getMenus } from '@/collections/Menus/getMenus'
import { DrawerProvider } from './drawers'
import { MenuProvider } from './menus'

interface ContextsProps {
  children: ReactNode
}

const Contexts = async ({ children }: ContextsProps) => {
  const theDrawers = await getDrawers()
  const theMenus = await getMenus()

  return (
    <MenuProvider data={theMenus}>
      <DrawerProvider data={theDrawers}>{children}</DrawerProvider>
    </MenuProvider>
  )
}

export default Contexts
