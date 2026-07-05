import Link from 'next/link'

import { getCurrentCustomer } from '@/utilities/getCurrentCustomer'
import { formatMoney, formatOrderDate, SectionHeader } from '../components'

export const dynamic = 'force-dynamic'

export default async function OrdersPage() {
  const { customer, payload, user } = await getCurrentCustomer({
    disabledRedirect: '/account-disabled',
    nullUserRedirect: '/login?next=/account/orders',
  })

  if (!customer) return null

  const orders = await (payload.find as any)({
    collection: 'orders',
    depth: 0,
    limit: 25,
    overrideAccess: false,
    sort: '-createdAt',
    user,
    where: {
      customer: {
        equals: customer.id,
      },
    },
  })

  return (
    <div>
      <SectionHeader eyebrow="Account" title="Orders" />

      {orders.docs.length ? (
        <div className="overflow-hidden rounded-lg border">
          <div className="hidden grid-cols-5 gap-4 border-b bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-700 md:grid">
            <span>Order</span>
            <span>Date</span>
            <span>Status</span>
            <span>Shipping</span>
            <span className="text-right">Total</span>
          </div>
          <div className="divide-y">
            {orders.docs.map((order: any) => (
              <Link
                className="grid gap-2 px-4 py-4 text-sm hover:bg-neutral-50 md:grid-cols-5 md:gap-4"
                href={`/account/orders/${order.id}`}
                key={order.id}
              >
                <span className="font-medium text-neutral-950">{order.orderNumber}</span>
                <span>{formatOrderDate(order.createdAt)}</span>
                <span className="capitalize">{String(order.status).replace('_', ' ')}</span>
                <span className="capitalize">{String(order.shippingStatus).replace('_', ' ')}</span>
                <span className="md:text-right">{formatMoney(order.total, order.currency)}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className="rounded-lg border p-5 text-sm text-neutral-500">No orders yet.</p>
      )}
    </div>
  )
}
