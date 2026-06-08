import type { Block } from 'payload'
import { submenuBlocks } from './blocks/submenu/config'

export const BlocksMenuBlock: Block = {
  slug: 'blocksMenu',
  fields: [
    {
      name: 'blocksMenu',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
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
        {
          name: 'items',
          type: 'blocks',
          blocks: submenuBlocks(),
        },
      ],
    },
  ],
}
