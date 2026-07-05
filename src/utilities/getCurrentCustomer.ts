import config from '@payload-config'
import { getPayload } from 'payload'

import type { Customer } from '@/payload-types'
import { getMeUser } from '@/utilities/getMeUser'
import { redirect } from 'next/navigation'

export const getCurrentCustomer = async (args?: {
  disabledRedirect?: string
  missingCustomerRedirect?: string
  nullUserRedirect?: string
}) => {
  const { token, user } = await getMeUser({
    nullUserRedirect: args?.nullUserRedirect,
  })

  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'customers',
    depth: 1,
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

  if (!customer && args?.missingCustomerRedirect) {
    redirect(args.missingCustomerRedirect)
  }

  if (customer?.accountStatus === 'disabled' && args?.disabledRedirect) {
    redirect(args.disabledRedirect)
  }

  return {
    customer,
    payload,
    token,
    user,
  }
}
