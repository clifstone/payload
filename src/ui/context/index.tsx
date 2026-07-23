import { ReactNode } from 'react'
import { getDrawers } from '@/collections/Drawers/getDrawers'
import { getMenus } from '@/collections/Menus/getMenus'
import { DrawerProvider } from './drawers'
import { MenuProvider } from './menus'
import { CustomerProvider } from './customer'

interface ContextsProps {
  children: ReactNode
}

const Contexts = async ({ children }: ContextsProps) => {
  const theDrawers = await getDrawers()
  const theMenus = await getMenus()

  return (
    <CustomerProvider>
      <MenuProvider data={theMenus}>
        <DrawerProvider data={theDrawers}>{children}</DrawerProvider>
      </MenuProvider>
    </CustomerProvider>
  )
}

export default Contexts
