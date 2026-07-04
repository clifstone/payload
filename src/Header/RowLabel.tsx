'use client'

import { Header } from '@/payload-types'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

type HeaderSection = NonNullable<Header['sections']>[number]
type HeaderComponent = NonNullable<HeaderSection['components']>[number]
type HeaderNavItemsBlock = Extract<HeaderComponent, { blockType: 'navItems' }>
type HeaderNavItem = NonNullable<HeaderNavItemsBlock['items']>[number]

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<HeaderNavItem>()

  const label = data?.data?.link?.label
    ? `Nav item ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data.data.link.label}`
    : 'Nav item'

  return <div>{label}</div>
}
