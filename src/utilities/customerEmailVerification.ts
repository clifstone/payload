import crypto from 'crypto'

import type { Payload } from 'payload'

import type { Customer } from '@/payload-types'
import { sendEmail } from '@/utilities/email/sendEmail'
import { getServerSideURL } from '@/utilities/getURL'

const VERIFICATION_TOKEN_BYTES = 32
const VERIFICATION_TOKEN_EXPIRATION_MS = 1000 * 60 * 60 * 24

export const hashEmailVerificationToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export const createEmailVerificationToken = (): {
  expiresAt: string
  token: string
  tokenHash: string
} => {
  const token = crypto.randomBytes(VERIFICATION_TOKEN_BYTES).toString('hex')

  return {
    expiresAt: new Date(Date.now() + VERIFICATION_TOKEN_EXPIRATION_MS).toISOString(),
    token,
    tokenHash: hashEmailVerificationToken(token),
  }
}

export const sendCustomerVerificationEmail = async ({
  customer,
  payload,
}: {
  customer: Customer
  payload: Payload
}): Promise<void> => {
  const { expiresAt, token, tokenHash } = createEmailVerificationToken()

  await payload.update({
    collection: 'customers',
    context: {
      allowCustomerSecurityUpdate: true,
    },
    data: {
      emailVerificationToken: tokenHash,
      emailVerificationTokenExpiresAt: expiresAt,
      emailVerified: false,
      emailVerifiedAt: null,
    },
    id: customer.id,
    overrideAccess: true,
  })

  const verificationLink = `${getServerSideURL()}/verify-email?token=${encodeURIComponent(token)}`

  await sendEmail({
    data: {
      customerID: customer.id,
      expiresAt,
      firstName: customer.firstName,
      verificationLink,
    },
    subject: 'Verify your email address',
    template: 'customer-email-verification',
    to: customer.email,
  })
}
