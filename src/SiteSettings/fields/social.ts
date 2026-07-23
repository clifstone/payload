import type { Field } from 'payload'

import { validateHTTPURL } from './validators'

export const socialFields: Field[] = [
  {
    name: 'socialLinks',
    type: 'array',
    label: 'Social Links',
    labels: {
      singular: 'Social Link',
      plural: 'Social Links',
    },
    admin: {
      initCollapsed: true,
    },
    fields: [
      {
        name: 'platform',
        type: 'select',
        required: true,
        options: [
          { label: 'Facebook', value: 'facebook' },
          { label: 'Twitter', value: 'twitter' },
          { label: 'Instagram', value: 'instagram' },
          { label: 'LinkedIn', value: 'linkedin' },
          { label: 'YouTube', value: 'youtube' },
          { label: 'Pinterest', value: 'pinterest' },
        ],
      },
      {
        name: 'handle',
        type: 'text',
        label: 'Social Handle',
        admin: {
          placeholder: '@handle',
        },
      },
      {
        name: 'url',
        type: 'text',
        label: 'Social Link',
        validate: validateHTTPURL,
        admin: {
          placeholder: 'https://…',
        },
      },
    ],
  },
]
