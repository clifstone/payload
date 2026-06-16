'use client'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import Button from '@/ui/buttons/simple'

type MenuProps = {
  title?: string
  children?: any
}

const MenuWrapper = ({ title, children }: MenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <div className="flex-grow flex flex-col relative bg-amber-50">
      <div className="w-full bg-orange-500">
        <Button variant="basic" onClick={toggleMenu}>
          {title ? title : 'Blocks Menu'}
        </Button>
      </div>
      <div className={clsx(menuOpen && 'flex flex-col', !menuOpen && 'hidden')}>
        {children && children}
      </div>
    </div>
  )
}

export default MenuWrapper
