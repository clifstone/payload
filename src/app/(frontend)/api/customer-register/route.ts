import config from '@payload-config'
import { getPayload } from 'payload'

import { sendCustomerVerificationEmail } from '@/utilities/customerEmailVerification'

type RegistrationBody = {
  email?: unknown
  firstName?: unknown
  lastName?: unknown
  password?: unknown
}

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0
}

export async function POST(request: Request): Promise<Response> {
  let body: RegistrationBody

  try {
    body = (await request.json()) as RegistrationBody
  } catch {
    return Response.json({ error: 'Invalid registration payload.' }, { status: 400 })
  }

  if (
    !isNonEmptyString(body.firstName) ||
    !isNonEmptyString(body.lastName) ||
    !isNonEmptyString(body.email) ||
    !isNonEmptyString(body.password)
  ) {
    return Response.json(
      { error: 'First name, last name, email, and password are required.' },
      { status: 400 },
    )
  }

  const firstName = body.firstName.trim()
  const lastName = body.lastName.trim()
  const email = body.email.trim().toLowerCase()
  const password = body.password

  const payload = await getPayload({ config })

  const existingUser = await payload.find({
    collection: 'users',
    depth: 0,
    limit: 1,
    where: {
      email: {
        equals: email,
      },
    },
  })

  if (existingUser.totalDocs > 0) {
    return Response.json(
      { error: 'An account already exists for this email address.' },
      { status: 409 },
    )
  }

  const user = await (payload.create as any)({
    collection: 'users',
    data: {
      email,
      name: firstName + ' ' + lastName,
      password,
      roles: ['customer'],
    } as Record<string, unknown>,
    depth: 0,
    overrideAccess: true,
  })

  const customerData = {
    accountStatus: 'active' as const,
    email,
    firstName,
    lastName,
    user: user.id,
  }

  try {
    const customer = await (payload.create as any)({
      collection: 'customers',
      context: {
        allowCustomerProfileUpdate: true,
      },
      data: customerData,
      depth: 0,
      overrideAccess: true,
    })

    await sendCustomerVerificationEmail({
      customer,
      payload,
    })

    return Response.json(
      {
        customer: {
          id: customer.id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
        },
        user: {
          id: user.id,
          email: user.email,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    await payload.delete({
      collection: 'users',
      id: user.id,
      overrideAccess: true,
    })

    payload.logger.error(
      {
        attemptedCustomer: customerData,
        err: error,
      },
      'Failed to create customer profile during registration',
    )
    return Response.json({ error: 'Unable to create customer account.' }, { status: 500 })
  }
}
