'use client'

import type { Menu } from '@/payload-types'
import type { MenuBlockItem } from './types'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import Button from '@/ui/buttons/simple'
import MenuItem from './menuItem'
import clsx from 'clsx'
import { useScreens } from '@/hooks/screens'
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined'

type MenuProps = {
  menu?: number | Menu | null
  buttonStyle?: 'dark' | 'light' | 'default' | null
  isOpen?: boolean
}

const PANEL_WIDTH = '28rem'

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

const BlocksMenu = ({ menu, isOpen = false }: MenuProps) => {
  if (!menu || typeof menu === 'number') return null

  const title = menu.title || 'Blocks Menu'
  const rootItems = (menu.items || []) as MenuBlockItem[]

  const [menuOpen, setMenuOpen] = useState(false)
  const [activePath, setActivePath] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  const trackRef = useRef<HTMLDivElement>(null)

  const { large } = useScreens()

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
    if (large) setMounted(true)
  }, [large])

  useEffect(() => {
    if (!trackRef.current) return

    gsap.to(trackRef.current, {
      xPercent: -100 * activeDepth,
      duration: 0.35,
      ease: 'power3.out',
    })
  }, [activeDepth])

  useEffect(() => {
    if (!menuOpen) {
      setActivePath([])
    }
  }, [menuOpen])

  if (!mounted) return null

  return (
    <div className="relative">
      <Button variant="basic" onClick={() => setMenuOpen((open) => !open)}>
        {title}
      </Button>

      {menuOpen && (
        <nav className="absolute left-0 top-full mt-2 overflow-hidden rounded-b-md border bg-white">
          <div className="overflow-hidden" style={{ width: PANEL_WIDTH }}>
            <div ref={trackRef} className="flex">
              {panels.map((items, depth) => {
                const panelHeader = getPanelHeader(rootItems, activePath, depth)

                return (
                  <section
                    key={depth}
                    className={clsx(
                      'max-h-[calc(100dvh-16rem)] shrink-0 overflow-y-auto scrollbar-clean',
                      PANEL_WIDTH,
                    )}
                    style={{ width: PANEL_WIDTH }}
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
                              <span className={clsx('large:group-hover:text-white')}>View All</span>
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
          </div>
        </nav>
      )}
    </div>
  )
}

export default BlocksMenu
