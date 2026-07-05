import Link from 'next/link'

import {
  AddressBlock,
  formatMoney,
  formatOrderDate,
  SectionHeader,
  ShortcutButton,
  type AccountAddress,
} from './components'
import { getCurrentCustomer } from '@/utilities/getCurrentCustomer'

export const dynamic = 'force-dynamic'

export default async function AccountDashboard() {
  const { customer, payload, user } = await getCurrentCustomer({
    disabledRedirect: '/account-disabled',
    nullUserRedirect: '/login?next=/account',
  })

  if (!customer) return null

  const addresses = (customer.addresses || []) as AccountAddress[]
  const defaultShipping = addresses.find((address) => address.isDefaultShipping)
  const defaultBilling = addresses.find((address) => address.isDefaultBilling)
  const completion = customer.profileCompletion || 0

  const recentOrders = await (payload.find as any)({
    collection: 'orders',
    depth: 0,
    limit: 3,
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
      <SectionHeader eyebrow="Your account" title={`Welcome, ${customer.firstName}`} />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-lg border p-5">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-neutral-950">Profile completion</h2>
            <span className="text-sm font-medium text-neutral-600">{completion}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full bg-neutral-950" style={{ width: `${completion}%` }} />
          </div>
          {customer.missingProfileFields?.length ? (
            <p className="mt-3 text-sm text-neutral-600">
              Add your missing profile details when you have a moment.
            </p>
          ) : (
            <p className="mt-3 text-sm text-neutral-600">Your profile basics are complete.</p>
          )}
        </section>

        <section className="rounded-lg border p-5">
          <h2 className="mb-4 text-lg font-semibold text-neutral-950">Shortcuts</h2>
          <div className="flex flex-wrap gap-2">
            <ShortcutButton href="/account/profile" label="Edit Profile" />
            <ShortcutButton href="/account/addresses" label="Manage Addresses" />
            <ShortcutButton href="/account/orders" label="View Orders" />
            <ShortcutButton href="/account/settings" label="Account Settings" />
          </div>
        </section>

        <section className="rounded-lg border p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-950">Recent orders</h2>
            <Link className="text-sm font-medium underline" href="/account/orders">
              View all
            </Link>
          </div>
          {recentOrders.docs.length ? (
            <div className="divide-y">
              {recentOrders.docs.map((order: any) => (
                <Link
                  className="grid gap-1 py-3 text-sm hover:bg-neutral-50 sm:grid-cols-4"
                  href={`/account/orders/${order.id}`}
                  key={order.id}
                >
                  <span className="font-medium text-neutral-950">{order.orderNumber}</span>
                  <span>{formatOrderDate(order.createdAt)}</span>
                  <span className="capitalize">{String(order.status).replace('_', ' ')}</span>
                  <span className="sm:text-right">{formatMoney(order.total, order.currency)}</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-500">No orders yet.</p>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-5">
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">Default shipping</h2>
            <AddressBlock address={defaultShipping} />
          </div>
          <div className="rounded-lg border p-5">
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">Default billing</h2>
            <AddressBlock address={defaultBilling} />
          </div>
        </section>
      </div>
    </div>
  )
}
