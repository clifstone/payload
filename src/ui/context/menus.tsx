'use client'

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'

export type MenuState = Record<string, boolean>

export interface MenuContextType {
  menus: MenuState
  toggleMenu: (name: string) => void
  getMenuBySlug: any
}

const MenuContext = createContext<MenuContextType | null>(null)

interface MenuProviderProps {
  data: any
  children: ReactNode
}

export const MenuProvider = ({ data, children }: MenuProviderProps) => {
  const [menus, setMenus] = useState<MenuState>({})

  const getMenuBySlug = (slug: string) => {
    return data.find((menu: any) => menu.slug === slug) || null
  }

  const toggleMenu = useCallback((name: string) => {
    setMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }, [])

  const value = useMemo<MenuContextType>(
    () => ({
      menus,
      toggleMenu,
      getMenuBySlug,
    }),
    [menus, toggleMenu, getMenuBySlug],
  )

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

export const useMenu = (): MenuContextType => {
  const context = useContext(MenuContext)

  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider')
  }

  return context
}
