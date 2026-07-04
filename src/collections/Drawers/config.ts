import type { CollectionConfig } from 'payload'

import { MenuReferenceBlock } from './blocks/menuReference/config'
import { LogoBlock } from './blocks/logoBlock/config'

export const Drawers: CollectionConfig = {
  slug: 'drawers',
  labels: {
    singular: 'Drawer',
    plural: 'Drawers',
  },
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Example: main-menu, cart, account',
      },
    },
    {
      name: 'items',
      type: 'blocks',
      label: 'Drawer Items',
      blocks: [MenuReferenceBlock, LogoBlock],
      admin: {
        initCollapsed: true,
      },
    },
  ],
}
