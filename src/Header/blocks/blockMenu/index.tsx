'use client'

import { useState } from 'react'
import Button from '@/ui/buttons/simple'
import MenuItem from './blocks/menuItem'
import type { MenuBlockItem } from './types'
import clsx from 'clsx'

/**
 * TODO:
 * cleanup old stuff.
 * change title of submenu to label and add a link field to the submenu block config.
 * menu is opened on click, so it also must be closed on click. needs a timeout if not interacted with.
 * we'll need a mobile view.
 */

type BlocksMenuProps = {
  blocksMenu?: {
    title?: string
    items?: MenuBlockItem[]
  }
}

const getPanelTitle = (rootItems: MenuBlockItem[], activePath: string[], depth: number) => {
  let items = rootItems
  let title = 'Submenu'

  for (let i = 0; i < depth; i++) {
    const activeItem = items.find((item) => item.id === activePath[i])

    if (!activeItem) break

    title = activeItem.title || activeItem.link?.label || title
    items = activeItem.items || []
  }

  return title
}

const BlocksMenu = ({ blocksMenu }: BlocksMenuProps) => {
  const title = blocksMenu?.title || 'Blocks Menu'
  const rootItems = blocksMenu?.items || []

  const [menuOpen, setMenuOpen] = useState(false)
  const [activePath, setActivePath] = useState<string[]>([])

  const panels: MenuBlockItem[][] = [rootItems]

  let currentItems = rootItems

  activePath.forEach((activeId) => {
    const activeItem = currentItems.find((item) => item.id === activeId)

    if (activeItem?.blockType === 'submenu' && activeItem.items?.length) {
      panels.push(activeItem.items)
      currentItems = activeItem.items
    }
  })

  const handleItemEnter = (item: MenuBlockItem, depth: number) => {
    setActivePath((prev) => {
      const next = prev.slice(0, depth)

      if (item.blockType === 'submenu') {
        next[depth] = item.id
      }

      return next
    })
  }

  return (
    <div className="relative">
      <Button variant="basic" onClick={() => setMenuOpen((open) => !open)}>
        {title}
      </Button>

      <div
        className={clsx(
          !menuOpen && 'translate-y-[-100%]',
          menuOpen && 'translate-y-[0%]',
          'absolute left-0 top-full mt-2 flex overflow-hidden rounded-b-md border bg-white shadow-lg transition-all z-[-1]',
        )}
      >
        {panels.map((items, depth) => (
          <div key={depth} className="w-72 shrink-0 overflow-y-auto border-r last:border-r-0">
            <div className="border-b px-4 py-3 font-semibold">
              {depth === 0 ? title : getPanelTitle(rootItems, activePath, depth)}
            </div>

            <div className="flex flex-col">
              {items.map((item) => {
                const isActive = activePath[depth] === item.id
                const hasChildren = item.blockType === 'submenu' && !!item.items?.length

                return (
                  <MenuItem
                    key={item.id}
                    item={item}
                    active={isActive}
                    hasChildren={hasChildren}
                    onMouseEnter={() => handleItemEnter(item, depth)}
                    onFocus={() => handleItemEnter(item, depth)}
                  />
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlocksMenu
