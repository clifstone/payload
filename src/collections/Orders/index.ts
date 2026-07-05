import type { Access, CollectionConfig, Field } from 'payload'

import { hasAdminRole } from '@/access/isAdmin'

const adminsOnly: Access = ({ req: { user } }) => {
  return hasAdminRole(user)
}

const adminsOrOwnOrders: Access = async ({ req: { payload, user } }) => {
  if (!user) return false
  if (hasAdminRole(user)) return true

  const { docs } = await payload.find({
    collection: 'customers',
    depth: 0,
    limit: 1,
    where: {
      user: {
        equals: user.id,
      },
    },
  })

  const customer = docs[0]

  if (!customer) return false

  return {
    customer: {
      equals: customer.id,
    },
  }
}

const addressSnapshotFields: Field[] = [
  {
    name: 'label',
    type: 'text',
  },
  {
    name: 'firstName',
    type: 'text',
  },
  {
    name: 'lastName',
    type: 'text',
  },
  {
    name: 'company',
    type: 'text',
  },
  {
    name: 'line1',
    type: 'text',
    label: 'Street address line 1',
  },
  {
    name: 'line2',
    type: 'text',
    label: 'Street address line 2',
  },
  {
    name: 'city',
    type: 'text',
  },
  {
    name: 'stateProvince',
    type: 'text',
    label: 'State / province',
  },
  {
    name: 'postalCode',
    type: 'text',
    label: 'Postal / ZIP code',
  },
  {
    name: 'country',
    type: 'text',
  },
  {
    name: 'phone',
    type: 'text',
  },
]

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    admin: ({ req }) => hasAdminRole(req.user),
    create: adminsOnly,
    delete: adminsOnly,
    read: adminsOrOwnOrders,
    update: adminsOnly,
  },
  admin: {
    defaultColumns: ['orderNumber', 'customer', 'status', 'total', 'createdAt'],
    group: 'Ecommerce',
    listSearchableFields: ['orderNumber'],
    useAsTitle: 'orderNumber',
  },
  fields: [
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      index: true,
    },
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'processing',
      options: [
        { label: 'Processing', value: 'processing' },
        { label: 'Paid', value: 'paid' },
        { label: 'Fulfilled', value: 'fulfilled' },
        { label: 'Completed', value: 'completed' },
        { label: 'Canceled', value: 'canceled' },
      ],
      required: true,
    },
    {
      name: 'shippingStatus',
      type: 'select',
      defaultValue: 'not_shipped',
      options: [
        { label: 'Not shipped', value: 'not_shipped' },
        { label: 'Preparing', value: 'preparing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
      ],
      required: true,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'USD',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'sku',
          type: 'text',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'lineTotal',
          type: 'number',
          required: true,
          min: 0,
        },
      ],
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: addressSnapshotFields,
    },
    {
      name: 'billingAddress',
      type: 'group',
      fields: addressSnapshotFields,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'trackingNumber',
          type: 'text',
        },
        {
          name: 'trackingURL',
          type: 'text',
          label: 'Tracking URL',
        },
      ],
    },
  ],
  timestamps: true,
}
