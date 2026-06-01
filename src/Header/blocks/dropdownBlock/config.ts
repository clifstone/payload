import type { Block } from 'payload'

import { link } from '@/fields/link'

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
      name: 'items',
      dbName: 'it',
      type: 'array',
      label: 'MAIN PANEL',
      maxRows: 8,
      admin: {
        initCollapsed: true,
      },
      fields: [
        link({
          appearances: false,
        }),
        {
          name: 'childItems',
          dbName: 'ch',
          type: 'array',
          label: 'SUB PANEL 1',
          maxRows: 8,
          admin: {
            initCollapsed: true,
          },
          fields: [
            link({
              appearances: false,
            }),
            {
              name: 'grandchildItems',
              dbName: 'gc',
              type: 'array',
              label: 'SUB PANEL 2',
              maxRows: 8,
              admin: {
                initCollapsed: true,
              },
              fields: [
                link({
                  appearances: false,
                }),
              ],
            },
          ],
        },
        {
          name: 'itemsStyle',
          type: 'radio',
          label: 'Items style',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ],
        },
      ],
    },
  ],
}
