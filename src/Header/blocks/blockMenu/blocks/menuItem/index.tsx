import clsx from 'clsx'
import Link from 'next/link'
import type { MenuBlockItem } from '../../types'

type MenuItemProps = {
  item: MenuBlockItem
  active: boolean
  hasChildren: boolean
  onMouseEnter: () => void
  onFocus: () => void
}

export default function MenuItem({
  item,
  active,
  hasChildren,
  onMouseEnter,
  onFocus,
}: MenuItemProps) {
  const label =
    item.blockType === 'submenu' ? item.title || 'Submenu' : item.link?.label || 'Menu Item'

  const className = clsx(
    'flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-gray-100',
    active && 'bg-gray-100 font-medium',
  )

  if (item.blockType === 'menuLink') {
    return (
      <Link
        href={item.link?.url || '#'}
        target={item.link?.newTab ? '_blank' : undefined}
        className={className}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
      >
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <button type="button" className={className} onMouseEnter={onMouseEnter} onFocus={onFocus}>
      <span>{label}</span>
      {hasChildren && <span aria-hidden>›</span>}
    </button>
  )
}
