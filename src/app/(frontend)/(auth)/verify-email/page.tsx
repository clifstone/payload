import config from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'

import { Button } from '@/components/ui/button'
import { hashEmailVerificationToken } from '@/utilities/customerEmailVerification'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams?: Promise<{
    token?: string
  }>
}

const resultCopy = {
  already: {
    body: 'This email address has already been verified.',
    title: 'Email already verified',
  },
  expired: {
    body: 'This verification link is invalid or expired. Log in to request a new one.',
    title: 'Verification link expired',
  },
  success: {
    body: 'Your email address has been verified.',
    title: 'Email verified',
  },
}

export default async function VerifyEmailPage({ searchParams }: PageProps) {
  const token = (await searchParams)?.token
  let result: keyof typeof resultCopy = 'expired'

  if (token) {
    const payload = await getPayload({ config })
    const tokenHash = hashEmailVerificationToken(token)
    const { docs } = await payload.find({
      collection: 'customers',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      where: {
        emailVerificationToken: {
          equals: tokenHash,
        },
      },
    })

    const customer = docs[0]

    if (customer?.emailVerified) {
      result = 'already'
    } else if (
      customer?.emailVerificationTokenExpiresAt &&
      new Date(customer.emailVerificationTokenExpiresAt).getTime() > Date.now()
    ) {
      await payload.update({
        collection: 'customers',
        context: {
          allowCustomerSecurityUpdate: true,
        },
        data: {
          emailVerificationToken: null,
          emailVerificationTokenExpiresAt: null,
          emailVerified: true,
          emailVerifiedAt: new Date().toISOString(),
        },
        id: customer.id,
        overrideAccess: true,
      })
      result = 'success'
    }
  }

  const copy = resultCopy[result]

  return (
    <main className="mx-auto grid min-h-[70dvh] w-full max-w-md content-center px-4 py-12">
      <div className="rounded-lg border p-6">
        <h1 className="mb-2 text-3xl font-semibold text-neutral-950">{copy.title}</h1>
        <p className="mb-6 text-sm text-neutral-600">{copy.body}</p>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href="/account">Go to account</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
