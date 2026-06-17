'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/ui/buttons/simple'
import MenuItem from './blocks/menuItem'
import type { MenuBlockItem } from './types'
import clsx from 'clsx'

/**
 * TODO:
 * cleanup old stuff.
 * change title of submenu to label and add a link field to the submenu block config.
 * menu is opened on click, so it also must be closed on click. needs a timeout if not interacted with.
 * make the panels responsive within the window.
 * make a backround -- full screen -- will need boundingClientRect thing.
 * we'll need a mobile view.
 */

type BlocksMenuProps = {
  blocksMenu?: {
    title?: string
    items?: MenuBlockItem[]
  }
}

const getPanelHeader = (rootItems: MenuBlockItem[], activePath: string[], depth: number) => {
  let items = rootItems
  let header = {
    label: 'Submenu',
    url: '/',
  }

  for (let i = 0; i < depth; i++) {
    const activeItem = items.find((item) => item.id === activePath[i])

    if (!activeItem) break

    header = {
      label: activeItem.label || activeItem.link?.label || header.label,
      url: activeItem.url || activeItem.link?.url || header.url,
    }

    items = activeItem.items || []
  }

  return header
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

      {menuOpen && (
        <div
          className={clsx(
            'absolute left-0 top-full mt-2 flex overflow-hidden rounded-b-md border bg-white',
          )}
        >
          {panels.map((items, depth) => {
            const panelHeader = getPanelHeader(rootItems, activePath, depth)
            return (
              <div
                key={depth}
                className="w-80 max-h-[calc(100dvh-180px)] shrink-0 overflow-y-auto border-r last:border-r-0"
              >
                <div className="border-b px-4 py-3 font-semibold">
                  {depth === 0 ? title : <Link href={panelHeader.url}>{panelHeader.label}</Link>}
                </div>

                <div className="flex flex-col">
                  {items.map((item) => {
                    const isActive = activePath[depth] === item.id
                    const hasChildren = item.blockType === 'submenu' && !!item.items?.length

                    console.log(item)

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
            )
          })}
        </div>
      )}
    </div>
  )
}

export default BlocksMenu

// {
// "id": "6a31ffb101e516da15b25bb7",
// "label": "Category 4",
// "url": "/",
// "blockName": null,
// "blockType": "submenu",
// "items": [
//     {
//     "id": "6a31ffc501e516da15b25bbb",
//     "blockName": null,
//     "blockType": "menuLink",
//     "link": {
//       "type": "custom",
//       "newTab": null,
//       "url": "/",
//       "label": "Category 4 subcategory"
//       }
//     }
//   ]
// }
