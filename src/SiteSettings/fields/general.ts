import type { Field } from 'payload'

import { validateHexColor } from './validators'

export const generalFields: Field[] = [
  {
    name: 'siteTitle',
    type: 'text',
    label: 'Site Title',
  },
  {
    name: 'siteDescription',
    type: 'textarea',
    label: 'Site Description',
    maxLength: 160,
    admin: {
      description: 'A concise site description. Maximum 160 characters.',
    },
  },
  {
    name: 'siteKeywords',
    type: 'textarea',
    label: 'Site Keywords',
    admin: {
      description: 'Use a comma-delimited list, for example: keyword, keyword two, keyword three.',
    },
  },
  {
    name: 'twitterHandle',
    type: 'text',
    label: 'Twitter Handle',
    admin: {
      placeholder: '@handle',
    },
  },
  {
    name: 'siteThemeColor',
    type: 'text',
    label: 'Theme Hex Color',
    validate: validateHexColor,
    admin: {
      description: 'Used to style supported browser interface elements.',
      placeholder: '#1A2B3C',
    },
  },
  {
    name: 'siteMicrosoftTileColor',
    type: 'text',
    label: 'Microsoft Tile Background Hex Color',
    validate: validateHexColor,
    admin: {
      description: 'Background color used when the website is pinned on Microsoft devices.',
      placeholder: '#1A2B3C',
    },
  },
]
