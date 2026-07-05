import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Field, NativeInput, StatusMessage } from '../../account/components'
import { requestPasswordReset } from '../actions'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams?: Promise<{
    status?: string
  }>
}

export default async function ForgotPasswordPage({ searchParams }: PageProps) {
  const status = (await searchParams)?.status

  return (
    <main className="mx-auto grid min-h-[70dvh] w-full max-w-md content-center px-4 py-12">
      <div className="rounded-lg border p-6">
        <h1 className="mb-2 text-3xl font-semibold text-neutral-950">Reset password</h1>
        <p className="mb-6 text-sm text-neutral-600">
          Enter your email and we will send reset instructions if an account exists.
        </p>
        <StatusMessage status={status} />
        <form action={requestPasswordReset} className="grid gap-4">
          <Field label="Email address">
            <NativeInput name="email" required type="email" />
          </Field>
          <Button type="submit">Send reset link</Button>
        </form>
        <p className="mt-5 text-sm text-neutral-600">
          Remembered it?{' '}
          <Link className="font-medium underline" href="/login">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
