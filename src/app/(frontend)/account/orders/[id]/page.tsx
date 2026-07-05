import { notFound } from 'next/navigation'

import { getCurrentCustomer } from '@/utilities/getCurrentCustomer'
import { AddressBlock, formatMoney, formatOrderDate, SectionHeader } from '../../components'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params
  const { customer, payload, user } = await getCurrentCustomer({
    disabledRedirect: '/account-disabled',
    nullUserRedirect: '/login?next=/account/orders/' + id,
  })

  if (!customer) return null

  const order = await (payload.findByID as any)({
    collection: 'orders',
    depth: 0,
    id,
    overrideAccess: false,
    user,
  }).catch(() => null)

  if (!order || Number(order.customer) !== customer.id) {
    notFound()
  }

  return (
    <div>
      <SectionHeader eyebrow="Order" title={order.orderNumber} />

      <div className="grid gap-5">
        <section className="grid gap-4 rounded-lg border p-5 md:grid-cols-4">
          <div>
            <p className="text-sm text-neutral-500">Date</p>
            <p className="font-medium text-neutral-950">{formatOrderDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Status</p>
            <p className="font-medium capitalize text-neutral-950">
              {String(order.status).replace('_', ' ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Shipping</p>
            <p className="font-medium capitalize text-neutral-950">
              {String(order.shippingStatus).replace('_', ' ')}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Total</p>
            <p className="font-medium text-neutral-950">
              {formatMoney(order.total, order.currency)}
            </p>
          </div>
        </section>

        <section className="rounded-lg border p-5">
          <h2 className="mb-4 text-lg font-semibold text-neutral-950">Items</h2>
          <div className="divide-y">
            {(order.items || []).map((item: any) => (
              <div
                className="grid gap-2 py-3 text-sm sm:grid-cols-[1fr_auto_auto_auto]"
                key={item.id}
              >
                <div>
                  <p className="font-medium text-neutral-950">{item.name}</p>
                  {item.sku && <p className="text-neutral-500">SKU {item.sku}</p>}
                </div>
                <p>Qty {item.quantity}</p>
                <p>{formatMoney(item.unitPrice, order.currency)}</p>
                <p className="font-medium">{formatMoney(item.lineTotal, order.currency)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-lg border p-5">
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">Shipping address</h2>
            <AddressBlock address={order.shippingAddress} />
          </div>
          <div className="rounded-lg border p-5">
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">Billing address</h2>
            <AddressBlock address={order.billingAddress} />
          </div>
        </section>

        {(order.trackingNumber || order.trackingURL) && (
          <section className="rounded-lg border p-5">
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">Tracking</h2>
            {order.trackingNumber && (
              <p className="text-sm">Tracking number: {order.trackingNumber}</p>
            )}
            {order.trackingURL && (
              <a className="text-sm font-medium underline" href={order.trackingURL}>
                Track shipment
              </a>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
