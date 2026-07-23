import type { GlobalConfig } from 'payload'

import { faviconFields } from './fields/favicons'
import { generalFields } from './fields/general'
import { logoFields } from './fields/logos'
import { socialFields } from './fields/social'
import { thumbnailFields } from './fields/thumbnails'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Site',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: generalFields,
        },
        {
          label: 'Site Logos',
          fields: logoFields,
        },
        {
          label: 'Site Thumbnails',
          fields: thumbnailFields,
        },
        {
          label: 'Site Favicons',
          fields: faviconFields,
        },
        {
          label: 'Social Links',
          fields: socialFields,
        },
      ],
    },
  ],
}
