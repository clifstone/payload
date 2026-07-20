'use server'

import config from '@payload-config'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { generatePayloadCookie, getPayload } from 'payload'

import { sendCustomerVerificationEmail } from '@/utilities/customerEmailVerification'
import { sendEmail } from '@/utilities/email/sendEmail'
import { getServerSideURL } from '@/utilities/getURL'

type LoginResponse = {
  token?: string
  user?: {
    email?: string
    id: number
  }
}

const value = (formData: FormData, key: string): string => {
  return String(formData.get(key) || '').trim()
}

const checked = (formData: FormData, key: string): boolean => {
  return formData.get(key) === 'on'
}

const redirectWithStatus = (path: string, status: string): never => {
  const separator = path.includes('?') ? '&' : '?'
  redirect(`${path}${separator}status=${encodeURIComponent(status)}`)
}

const safeNextPath = (next: string | null | undefined): string => {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return '/account'
  return next
}

const setPayloadTokenCookie = async (token: string): Promise<void> => {
  const payload = await getPayload({ config })
  const authConfig = payload.collections.users.config.auth

  if (!authConfig) {
    throw new Error('Users collection auth config is unavailable.')
  }

  const payloadCookie = generatePayloadCookie({
    collectionAuthConfig: authConfig,
    cookiePrefix: payload.config.cookiePrefix,
    returnCookieAsObject: true,
    token,
  })

  const cookieStore = await cookies()

  if (payloadCookie.value) {
    cookieStore.set(payloadCookie.name, payloadCookie.value, {
      domain: payloadCookie.domain,
      expires: payloadCookie.expires ? new Date(payloadCookie.expires) : undefined,
      httpOnly: payloadCookie.httpOnly,
      maxAge: payloadCookie.maxAge,
      path: payloadCookie.path,
      sameSite: payloadCookie.sameSite?.toLowerCase() as 'lax' | 'none' | 'strict' | undefined,
      secure: payloadCookie.secure,
    })
  }
}

const clearPayloadTokenCookie = async (): Promise<void> => {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
}

const loginWithPayload = async (email: string, password: string): Promise<LoginResponse | null> => {
  const response = await fetch(`${getServerSideURL()}/api/users/login`, {
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  })

  if (!response.ok) return null

  return (await response.json()) as LoginResponse
}

export const registerCustomer = async (formData: FormData): Promise<void> => {
  const firstName = value(formData, 'firstName')
  const lastName = value(formData, 'lastName')
  const email = value(formData, 'email').toLowerCase()
  const password = value(formData, 'password')
  const iUnderstand = checked(formData, 'iUnderstand')
  const marketingEmailOptIn = checked(formData, 'marketingEmailOptIn')

  if (!firstName || !lastName || !email || !password || !iUnderstand) {
    redirectWithStatus('/register', 'missing-required')
  }

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
    redirectWithStatus('/register', 'account-exists')
  }

  const user = await payload.create({
    collection: 'users',
    data: {
      email,
      name: `${firstName} ${lastName}`,
      password,
      roles: ['customer'],
    },
    depth: 0,
    overrideAccess: true,
  })

  const customerData = {
    accountStatus: 'active' as const,
    email,
    firstName,
    lastName,
    marketingEmailOptIn,
    user: user.id,
  }

  try {
    const customer = await payload.create({
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
    redirectWithStatus('/register', 'registration-failed')
  }

  const login = await loginWithPayload(email, password)
  const token = login?.token

  if (!token) {
    redirectWithStatus('/login', 'registered-login-required')
  }

  const verifiedToken = token as string

  await setPayloadTokenCookie(verifiedToken)
  redirect('/account')
}

const sendPasswordResetEmail = async (formData: FormData): Promise<'missing-required' | 'password-reset-sent'> => {
  const email = value(formData, 'email').toLowerCase()

  if (!email) {
    return 'missing-required'
  }

  const payload = await getPayload({ config })
  const token = await payload
    .forgotPassword({
      collection: 'users',
      data: {
        email,
      },
      disableEmail: true,
      overrideAccess: true,
    })
    .catch((error) => {
      payload.logger.warn({ err: error }, 'Customer password reset request failed')
      return null
    })

  if (token) {
    const resetLink = `${getServerSideURL()}/reset-password?token=${encodeURIComponent(token)}`

    await sendEmail({
      data: {
        resetLink,
      },
      subject: 'Reset your password',
      template: 'customer-password-reset',
      to: email,
    })
  }

  return 'password-reset-sent'
}

export const requestPasswordReset = async (formData: FormData): Promise<void> => {
  const status = await sendPasswordResetEmail(formData)

  redirectWithStatus('/forgot-password', status)
}

export const requestPasswordResetInPlace = async (
  _previousStatus: string | undefined,
  formData: FormData,
): Promise<string> => {
  return sendPasswordResetEmail(formData)
}

export const resetCustomerPassword = async (formData: FormData): Promise<void> => {
  const token = value(formData, 'token')
  const password = value(formData, 'password')
  const passwordConfirm = value(formData, 'passwordConfirm')

  if (!token) {
    redirectWithStatus('/reset-password', 'reset-token-invalid')
  }

  if (!password || password.length < 8 || password !== passwordConfirm) {
    redirectWithStatus(
      `/reset-password?token=${encodeURIComponent(token)}`,
      'password-confirmation-invalid',
    )
  }

  const payload = await getPayload({ config })
  const result = await payload
    .resetPassword({
      collection: 'users',
      data: {
        password,
        token,
      },
      overrideAccess: true,
    })
    .catch((error) => {
      payload.logger.warn({ err: error }, 'Customer password reset failed')
      return null
    })

  if (!result) {
    redirectWithStatus('/reset-password', 'reset-token-invalid')
    return
  }

  if (result.token) {
    await setPayloadTokenCookie(result.token)
    redirect('/account/settings?status=password-reset')
  }

  redirect('/login?status=password-reset')
}

export const loginCustomer = async (formData: FormData): Promise<void> => {
  const email = value(formData, 'email').toLowerCase()
  const password = value(formData, 'password')
  const next = safeNextPath(value(formData, 'next'))

  if (!email || !password) {
    redirectWithStatus(`/login?next=${encodeURIComponent(next)}`, 'missing-required')
  }

  const login = await loginWithPayload(email, password)
  const token = login?.token
  const user = login?.user

  if (!token || !user) {
    redirectWithStatus(`/login?next=${encodeURIComponent(next)}`, 'invalid-login')
  }

  const verifiedToken = token as string
  const verifiedUser = user as NonNullable<LoginResponse['user']>

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'customers',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      user: {
        equals: verifiedUser.id,
      },
    },
  })

  const customer = docs[0]

  if (!customer) {
    redirectWithStatus('/login', 'customer-profile-missing')
  }

  if (customer.accountStatus === 'disabled') {
    await clearPayloadTokenCookie()
    redirect('/account-disabled')
  }

  await setPayloadTokenCookie(verifiedToken)
  redirect(next)
}

export const logoutCustomer = async (): Promise<void> => {
  await clearPayloadTokenCookie()
  redirect('/login?status=logged-out')
}
