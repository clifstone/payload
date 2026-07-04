import clsx from 'clsx'
import Link from 'next/link'
import type { MenuBlockItem } from './types'
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined'

type MenuItemProps = {
  item: MenuBlockItem
  active: boolean
  hasChildren: boolean
  onMouseEnter?: () => void
  onFocus?: () => void
  onClick?: () => void
}

const MenuItem = ({ item, active, hasChildren, onMouseEnter, onFocus, onClick }: MenuItemProps) => {
  const label =
    item.blockType === 'submenu' ? item.label || 'Submenu' : item.link?.label || 'Menu Item'

  const className = clsx(
    'flex w-full items-center justify-between text-left p-4',
    'hover:bg-neutral-100',
    active && 'bg-neutral-100',
    'border-b last:border-b-0',
  )

  if (item.blockType === 'menuLink') {
    return (
      <Link
        href={item.link?.url || '#'}
        target={item.link?.newTab ? '_blank' : undefined}
        className={className}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
        onClick={onClick}
      >
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={className}
      onMouseEnter={onMouseEnter}
      onFocus={onFocus}
      onClick={onClick}
    >
      <span>{label}</span>
      {hasChildren && (
        <i className="w-[22px]" aria-hidden>
          <KeyboardArrowRightOutlinedIcon />
        </i>
      )}
    </button>
  )
}

export default MenuItem
