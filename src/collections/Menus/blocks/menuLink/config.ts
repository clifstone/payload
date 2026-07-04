import type { Block } from 'payload'

import { link } from '@/fields/link'

export const LinkMenuBlock: Block = {
  slug: 'menuLink',
  labels: {
    singular: 'Link',
    plural: 'Links',
  },
  fields: [
    link({
      appearances: false,
    }),
  ],
}
