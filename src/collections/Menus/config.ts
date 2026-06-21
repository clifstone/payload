import type { CollectionConfig } from 'payload'

import { submenuBlocks } from './blocks/submenu/config'

export const Menus: CollectionConfig = {
  slug: 'menus',
  labels: {
    singular: 'Menu',
    plural: 'Menus',
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
        description: 'Example: main-menu, footer-menu, mobile-menu',
      },
    },
    {
      name: 'items',
      type: 'blocks',
      label: 'Menu items',
      blocks: submenuBlocks(),
      admin: {
        initCollapsed: true,
      },
    },
  ],
}
