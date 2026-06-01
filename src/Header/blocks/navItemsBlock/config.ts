import type { Block } from 'payload'

import { link } from '@/fields/link'

export const NavItemsBlock: Block = {
  slug: 'navItems',
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
  ],
}
