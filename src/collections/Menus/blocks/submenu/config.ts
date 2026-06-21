import type { Block } from 'payload'

import { LinkMenuBlock } from '../menuLink/config'

const MAX_SUBMENU_DEPTH = 3

export const submenuBlocks = (depth = 0, maxDepth = MAX_SUBMENU_DEPTH): Block[] => [
  LinkMenuBlock,

  ...(depth < maxDepth
    ? [
        {
          slug: 'submenu',
          labels: {
            singular: 'Submenu',
            plural: 'Submenus',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Submenu Label',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              label: 'Submenu URL',
              required: false,
              admin: {
                description: 'Optional URL for the submenu parent item.',
              },
            },
            {
              name: 'items',
              type: 'blocks',
              label: 'Submenu items',
              admin: {
                initCollapsed: true,
              },
              blocks: submenuBlocks(depth + 1, maxDepth),
            },
          ],
        } satisfies Block,
      ]
    : []),
]
