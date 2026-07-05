import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import {
  adminFieldOnly,
  adminsOnly,
  adminsOrSelfCustomer,
  customersAdminOnly,
} from '@/access/customerAccess'
import { hasAdminRole } from '@/access/isAdmin'

type CustomerAddress = {
  id?: string | null
  isDefaultBilling?: boolean | null
  isDefaultShipping?: boolean | null
}

const normalizeDefaultAddress = (
  addresses: CustomerAddress[] | null | undefined,
  field: 'isDefaultBilling' | 'isDefaultShipping',
): string | undefined => {
  if (!addresses?.length) return undefined

  let defaultAddressID: string | undefined
  let hasDefault = false

  for (const address of addresses) {
    if (address[field] && !hasDefault) {
      hasDefault = true
      defaultAddressID = address.id || undefined
      address[field] = true
    } else {
      address[field] = false
    }
  }

  if (!hasDefault) {
    addresses[0][field] = true
    defaultAddressID = addresses[0].id || undefined
  }

  return defaultAddressID
}

const getMissingProfileFields = (data: Record<string, unknown>): string[] => {
  const addresses = Array.isArray(data.addresses) ? (data.addresses as CustomerAddress[]) : []
  const hasDefaultShipping = addresses.some((address) => address.isDefaultShipping)
  const hasDefaultBilling = addresses.some((address) => address.isDefaultBilling)

  return [
    !data.phone ? 'phone' : undefined,
    !hasDefaultShipping ? 'shippingAddress' : undefined,
    !hasDefaultBilling ? 'billingAddress' : undefined,
  ].filter(Boolean) as string[]
}

const normalizeCustomer: CollectionBeforeChangeHook = ({ context, data, originalDoc, req }) => {
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

  const addresses = Array.isArray(data.addresses) ? (data.addresses as CustomerAddress[]) : null

  if (addresses) {
    data.defaultShippingAddress =
      normalizeDefaultAddress(addresses, 'isDefaultShipping') || data.defaultShippingAddress || null
    data.defaultBillingAddress =
      normalizeDefaultAddress(addresses, 'isDefaultBilling') || data.defaultBillingAddress || null
  }

  const missingProfileFields = getMissingProfileFields(data)
  data.profileCompletion = missingProfileFields.length
    ? Math.round(((3 - missingProfileFields.length) / 3) * 100)
    : 100
  data.missingProfileFields = missingProfileFields

  if (hasAdminRole(user)) {
    return data
  }

  if (originalDoc && !context.allowCustomerProfileUpdate) {
    data.user = originalDoc.user
    data.email = originalDoc.email
    data.accountStatus = originalDoc.accountStatus
    data.internalAdminNotes = originalDoc.internalAdminNotes
  }

  if (originalDoc && !context.allowCustomerSecurityUpdate) {
    data.emailVerificationToken = originalDoc.emailVerificationToken
    data.emailVerificationTokenExpiresAt = originalDoc.emailVerificationTokenExpiresAt
    data.emailVerified = originalDoc.emailVerified
    data.emailVerifiedAt = originalDoc.emailVerifiedAt
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
    defaultColumns: ['firstName', 'lastName', 'email', 'emailVerified', 'accountStatus'],
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
      index: true,
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
          name: 'company',
          type: 'text',
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
      index: true,
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
      type: 'row',
      fields: [
        {
          name: 'emailVerified',
          type: 'checkbox',
          defaultValue: false,
          index: true,
          label: 'Email verified',
          admin: {
            position: 'sidebar',
          },
        },
        {
          name: 'emailVerifiedAt',
          type: 'date',
          label: 'Email verified at',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
            position: 'sidebar',
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'emailVerificationToken',
      type: 'text',
      access: {
        create: adminFieldOnly,
        read: adminFieldOnly,
        update: adminFieldOnly,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'emailVerificationTokenExpiresAt',
      type: 'date',
      access: {
        create: adminFieldOnly,
        read: adminFieldOnly,
        update: adminFieldOnly,
      },
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
        readOnly: true,
      },
      label: 'Email verification expires',
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
    {
      name: 'profileCompletion',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'missingProfileFields',
      type: 'select',
      hasMany: true,
      options: [
        {
          label: 'Phone number',
          value: 'phone',
        },
        {
          label: 'Shipping address',
          value: 'shippingAddress',
        },
        {
          label: 'Billing address',
          value: 'billingAddress',
        },
      ],
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [normalizeCustomer],
  },
  timestamps: true,
}
