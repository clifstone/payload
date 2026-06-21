import type { GlobalConfig } from 'payload'

import { LogoBlock } from './blocks/logoBlock/config'
import { MenuButtonBlock } from './blocks/menuButtonBlock/config'
import { AccountButtonBlock } from './blocks/accountButtonBlock/config'
import { MiniCartButtonBlock } from './blocks/miniCartButtonBlock/config'
import { MenuReferenceBlock } from './blocks/menuReferenceBlock/config'
import { revalidateHeader } from './hooks/revalidateHeader'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'sections',
      type: 'array',
      maxRows: 8,
      fields: [
        {
          name: 'fullWidth',
          type: 'checkbox',
          defaultValue: false,
          label: 'Full width',
        },
        {
          name: 'alignment',
          type: 'radio',
          defaultValue: 'left',
          label: 'Alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
        {
          name: 'components',
          type: 'blocks',
          blocks: [
            LogoBlock,
            MenuButtonBlock,
            AccountButtonBlock,
            MiniCartButtonBlock,
            MenuReferenceBlock,
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
