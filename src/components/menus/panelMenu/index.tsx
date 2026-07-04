import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import clsx from 'clsx'
import type { Menu } from '@/payload-types'
import type { MenuBlockItem } from './types'
import MenuItem from './menuItem'
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined'

type MenuProps = {
  menu: number | Menu
  buttonStyle?: 'dark' | 'light' | 'default' | null
  isOpen?: boolean
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

const PanelMenu = ({ menu }: MenuProps) => {
  const [activePath, setActivePath] = useState<string[]>([])
  const rootItems: MenuBlockItem[] =
    typeof menu === 'number' ? [] : ((menu.items ?? []) as MenuBlockItem[])
  const trackRef = useRef<HTMLDivElement>(null)
  const panels: MenuBlockItem[][] = [rootItems]
  let currentItems = rootItems

  activePath.forEach((activeId) => {
    const activeItem = currentItems.find((item) => item.id === activeId)

    if (activeItem?.blockType === 'submenu' && activeItem.items?.length) {
      panels.push(activeItem.items)
      currentItems = activeItem.items
    }
  })

  const activeDepth = panels.length - 1

  const handleItemActivate = (item: MenuBlockItem, depth: number) => {
    setActivePath((prev) => {
      const next = prev.slice(0, depth)

      if (item.blockType === 'submenu' && item.items?.length) {
        next[depth] = item.id
      }

      return next
    })
  }

  const handleBack = () => {
    setActivePath((prev) => prev.slice(0, -1))
  }

  useEffect(() => {
    if (!trackRef.current) return

    gsap.to(trackRef.current, {
      xPercent: -100 * activeDepth,
      duration: 0.35,
      ease: 'power3.out',
    })
  }, [activeDepth])

  return (
    <nav className="w-full h-full overflow-hidden">
      <div ref={trackRef} className="flex h-full">
        {panels.map((items, depth) => {
          const panelHeader = getPanelHeader(rootItems, activePath, depth)
          return (
            <section
              key={depth}
              className={clsx('w-full shrink-0 overflow-y-auto scrollbar-clean')}
            >
              {depth !== 0 && (
                <header className="flex items-center border-b">
                  <div className="flex items-center justify-between w-full px-4">
                    <span className="text-lg font-bold">{panelHeader.label}</span>

                    {panelHeader.url && (
                      <Link
                        className={clsx(
                          'text-xs font-semibold uppercase border py-2 px-3 rounded-md group',
                          'transition-all duration-200',
                          'large:hover:bg-primary',
                        )}
                        href={panelHeader.url}
                      >
                        <span className={clsx('whitespace-nowrap', 'large:group-hover:text-white')}>
                          View All
                        </span>
                      </Link>
                    )}
                  </div>
                  <button
                    type="button"
                    className={clsx(
                      'flex border-l p-4 cursor-pointer',
                      'large:hover:bg-neutral-100',
                    )}
                    onClick={handleBack}
                  >
                    <i className="block w-[24px]">
                      <KeyboardBackspaceOutlinedIcon />
                    </i>
                  </button>
                </header>
              )}

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
                      onClick={() => handleItemActivate(item, depth)}
                      onFocus={() => handleItemActivate(item, depth)}
                    />
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </nav>
  )
}

export default PanelMenu
