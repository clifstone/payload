'use client'

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'

export type DrawerState = Record<string, boolean>

export interface DrawerContextType {
  drawers: DrawerState
  toggleDrawer: (name: string) => void
  getDrawerBySlug: any
}

const DrawerContext = createContext<DrawerContextType | null>(null)

interface DrawerProviderProps {
  data: any
  children: ReactNode
}

export const DrawerProvider = ({ data, children }: DrawerProviderProps) => {
  const [drawers, setDrawers] = useState<DrawerState>({})

  const getDrawerBySlug = (slug: string) => {
    return data.find((drawer: any) => drawer.slug === slug) || null
  }

  const toggleDrawer = useCallback((name: string) => {
    setDrawers((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }, [])

  const value = useMemo<DrawerContextType>(
    () => ({
      drawers,
      toggleDrawer,
      getDrawerBySlug,
    }),
    [drawers, toggleDrawer, getDrawerBySlug],
  )

  return <DrawerContext.Provider value={value}>{children}</DrawerContext.Provider>
}

export const useDrawer = (): DrawerContextType => {
  const context = useContext(DrawerContext)

  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider')
  }

  return context
}
