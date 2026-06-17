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
    item.blockType === 'submenu' ? item.label || 'Submenu' : item.link?.label || 'Menu Item'

  const className = clsx(
    'flex w-full items-center justify-between text-left text-sm p-4',
    'hover:bg-neutral-100',
    active && 'bg-neutral-100',
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
