import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import {
  adminFieldOnly,
  adminsOnly,
  adminsOrSelfCustomer,
  customersAdminOnly,
} from '@/access/customerAccess'
import { hasAdminRole } from '@/access/isAdmin'

const normalizeCustomer: CollectionBeforeChangeHook = ({ data, originalDoc, req }) => {
  const { user } = req

  if (typeof data.email === 'string') {
    data.email = data.email.trim().toLowerCase()
  }

  if (typeof data.firstName === 'string') {
    data.firstName = data.firstName.trim()
  }

  if (typeof data.lastName === 'string') {
    data.lastName = data.lastName.trim()
  }

  if (hasAdminRole(user)) {
    return data
  }

  if (originalDoc) {
    data.user = originalDoc.user
    data.email = originalDoc.email
    data.accountStatus = originalDoc.accountStatus
    data.internalAdminNotes = originalDoc.internalAdminNotes
  }

  return data
}

export const Customers: CollectionConfig = {
  slug: 'customers',
  access: {
    admin: customersAdminOnly,
    create: adminsOnly,
    delete: adminsOnly,
    read: adminsOrSelfCustomer,
    update: adminsOrSelfCustomer,
  },
  admin: {
    defaultColumns: ['firstName', 'lastName', 'email', 'accountStatus'],
    group: 'Ecommerce',
    listSearchableFields: ['firstName', 'lastName', 'email'],
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      index: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'smsOptIn',
          type: 'checkbox',
          defaultValue: false,
          label: 'SMS updates opt-in',
        },
        {
          name: 'marketingEmailOptIn',
          type: 'checkbox',
          defaultValue: false,
          label: 'Marketing email opt-in',
        },
      ],
    },
    {
      name: 'addresses',
      type: 'array',
      labels: {
        singular: 'Saved address',
        plural: 'Saved addresses',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Home',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'firstName',
              type: 'text',
              required: true,
            },
            {
              name: 'lastName',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'line1',
          type: 'text',
          label: 'Street address line 1',
          required: true,
        },
        {
          name: 'line2',
          type: 'text',
          label: 'Street address line 2',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'city',
              type: 'text',
              required: true,
            },
            {
              name: 'stateProvince',
              type: 'text',
              label: 'State / province',
              required: true,
            },
            {
              name: 'postalCode',
              type: 'text',
              label: 'Postal / ZIP code',
              required: true,
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'country',
              type: 'text',
              required: true,
            },
            {
              name: 'phone',
              type: 'text',
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'isDefaultShipping',
              type: 'checkbox',
              defaultValue: false,
              label: 'Default shipping',
            },
            {
              name: 'isDefaultBilling',
              type: 'checkbox',
              defaultValue: false,
              label: 'Default billing',
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'defaultShippingAddress',
          type: 'text',
          admin: {
            description:
              'Optional saved address row ID. Phase 1 can rely on address default flags.',
          },
        },
        {
          name: 'defaultBillingAddress',
          type: 'text',
          admin: {
            description:
              'Optional saved address row ID. Phase 1 can rely on address default flags.',
          },
        },
      ],
    },
    {
      name: 'accountStatus',
      type: 'select',
      defaultValue: 'active',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Disabled',
          value: 'disabled',
        },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'internalAdminNotes',
      type: 'textarea',
      access: {
        create: adminFieldOnly,
        read: adminFieldOnly,
        update: adminFieldOnly,
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [normalizeCustomer],
  },
  timestamps: true,
}
