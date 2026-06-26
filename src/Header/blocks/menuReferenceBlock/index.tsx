'use client'
import { useState, useEffect } from 'react'
import Button from '@/ui/buttons/simple'
import { useScreens } from '@/hooks/screens'
import PanelMenu from '@/components/menus/panelMenu'

const BlocksMenu = ({ menu }: any) => {
  if (!menu || typeof menu === 'number') return null

  const title = menu.title || 'Blocks Menu'

  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { large } = useScreens()

  useEffect(() => {
    if (large) setMounted(true)
  }, [large])

  if (!mounted) return null

  return (
    <div className="relative">
      <Button variant="basic" onClick={() => setMenuOpen((open) => !open)}>
        {title}
      </Button>

      {menuOpen && <PanelMenu menu={menu} />}
    </div>
  )
}

export default BlocksMenu
