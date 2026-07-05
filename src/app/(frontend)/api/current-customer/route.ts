import { cookies } from 'next/headers'
import { getPayload } from 'payload'

import config from '@payload-config'
import type { Customer, User } from '@/payload-types'
import { getClientSideURL } from '@/utilities/getURL'

const safeCustomer = (customer: Customer) => ({
  accountStatus: customer.accountStatus,
  addresses: customer.addresses || [],
  defaultBillingAddress: customer.defaultBillingAddress,
  defaultShippingAddress: customer.defaultShippingAddress,
  email: customer.email,
  emailVerified: customer.emailVerified,
  emailVerifiedAt: customer.emailVerifiedAt,
  firstName: customer.firstName,
  id: customer.id,
  lastName: customer.lastName,
  marketingEmailOptIn: customer.marketingEmailOptIn,
  missingProfileFields: customer.missingProfileFields || [],
  phone: customer.phone,
  profileCompletion: customer.profileCompletion,
  smsOptIn: customer.smsOptIn,
})

export async function GET(): Promise<Response> {
  const cookieStore = await cookies()
  const token = cookieStore.get('payload-token')?.value

  if (!token) {
    return Response.json({ error: 'Unauthenticated.' }, { status: 401 })
  }

  const meResponse = await fetch(`${getClientSideURL()}/api/users/me`, {
    cache: 'no-store',
    headers: {
      Authorization: `JWT ${token}`,
    },
  })

  if (!meResponse.ok) {
    return Response.json({ error: 'Unauthenticated.' }, { status: 401 })
  }

  const { user } = (await meResponse.json()) as { user?: User }

  if (!user) {
    return Response.json({ error: 'Unauthenticated.' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'customers',
    depth: 0,
    limit: 1,
    overrideAccess: false,
    user,
    where: {
      user: {
        equals: user.id,
      },
    },
  })

  const customer = docs[0] as Customer | undefined

  if (!customer) {
    return Response.json({ error: 'Customer profile not found.' }, { status: 404 })
  }

  if (customer.accountStatus === 'disabled') {
    return Response.json({ error: 'Customer account is disabled.' }, { status: 403 })
  }

  return Response.json({ customer: safeCustomer(customer) })
}
