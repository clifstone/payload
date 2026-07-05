import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { hasAdminRole, isAdminField } from '@/access/isAdmin'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req }) => hasAdminRole(req.user),
    create: authenticated,
    delete: ({ req }) => hasAdminRole(req.user),
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
  },
  auth: {
    forgotPassword: {
      expiration: 1000 * 60 * 60,
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      defaultValue: ['customer'],
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Customer',
          value: 'customer',
        },
      ],
      access: {
        create: isAdminField,
        update: isAdminField,
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
