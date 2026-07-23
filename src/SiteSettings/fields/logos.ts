import type { Field } from 'payload'

const folderDescription = 'Store this asset in Site Settings / Logos in the Media library.'

export const logoFields: Field[] = [
  {
    name: 'siteLogo',
    type: 'upload',
    relationTo: 'media',
    label: 'Site Logo',
    admin: { description: folderDescription },
  },
  {
    name: 'siteLogoSmall',
    type: 'upload',
    relationTo: 'media',
    label: 'Site Logo Small',
    admin: { description: folderDescription },
  },
  {
    name: 'siteLogoDark',
    type: 'upload',
    relationTo: 'media',
    label: 'Site Logo Dark',
    admin: { description: `For dark themes. ${folderDescription}` },
  },
  {
    name: 'siteLogoDarkSmall',
    type: 'upload',
    relationTo: 'media',
    label: 'Site Logo Dark Small',
    admin: { description: `For dark themes. ${folderDescription}` },
  },
  {
    name: 'siteLogoAlternative',
    type: 'upload',
    relationTo: 'media',
    label: 'Site Logo Alternative',
    admin: {
      description: `An optional seasonal or campaign logo. ${folderDescription}`,
    },
  },
]
