import type { Block, Field } from 'payload'
import { link } from '@/fields/link'

const menuLinks = (depth = 0, maxDepth = 3): Field[] => [
  link({
    appearances: false,
  }),

  ...(depth < maxDepth
    ? [
        {
          name: `c${depth}`,
          dbName: `c${depth}`,
          type: 'array',
          label: 'Panel links',
          admin: {
            initCollapsed: true,
          },
          fields: menuLinks(depth + 1, maxDepth),
        } satisfies Field,
      ]
    : []),
]

export const DropdownBlock: Block = {
  slug: 'dropdown',
  labels: {
    singular: 'Dropdown',
    plural: 'Dropdowns',
  },
  fields: [
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button text',
      required: true,
      defaultValue: 'Menu',
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
    {
      name: 'menus',
      dbName: 'mn',
      type: 'array',
      label: 'Menus',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Menu title',
          required: true,
        },
        {
          name: 'links',
          dbName: 'ln',
          type: 'array',
          label: 'Links',
          admin: {
            initCollapsed: true,
          },
          fields: menuLinks(0, 3),
        },
      ],
    },
  ],
}
