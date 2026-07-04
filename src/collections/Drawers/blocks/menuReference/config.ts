import type { Block, CollectionSlug } from 'payload'

export const MenuReferenceBlock: Block = {
  slug: 'menuReference',
  labels: {
    singular: 'Menu',
    plural: 'Menus',
  },
  fields: [
    {
      name: 'menu',
      type: 'relationship',
      relationTo: 'menus' as CollectionSlug,
      required: true,
    },
    {
      name: 'buttonStyle',
      type: 'radio',
      label: 'Button style',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
}
