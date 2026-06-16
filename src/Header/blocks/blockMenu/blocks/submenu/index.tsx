'use client'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import Button from '@/ui/buttons/simple'
import { RenderMenuBlocks, MenuBlockItem } from '../../renderMenuBlocks'
import MenuWrapper from '../../menuWrapper'

type SubmenuProps = {
  title?: string
  items?: MenuBlockItem[]
}

const Submenu = ({ title, items = [] }: SubmenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const ITEMS = items || []

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <div className="submenu flex-grow flex flex-col relative">
      <div className="">
        <Button variant="basic" onClick={toggleMenu}>
          {title ? title : 'Blocks Menu'}
        </Button>
      </div>
      <div className={clsx('bg-white border flex flex-col')}>
        {ITEMS && <RenderMenuBlocks items={ITEMS} />}
      </div>
    </div>
  )
}

export default Submenu
