import type { Block } from 'payload'

export const LogoBlock: Block = {
  slug: 'logo',
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
