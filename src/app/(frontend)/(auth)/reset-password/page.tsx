import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Field, NativeInput, StatusMessage } from '../../account/components'
import { resetCustomerPassword } from '../actions'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams?: Promise<{
    status?: string
    token?: string
  }>
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams
  const token = params?.token || ''

  return (
    <main className="mx-auto grid min-h-[70dvh] w-full max-w-md content-center px-4 py-12">
      <div className="rounded-lg border p-6">
        <h1 className="mb-2 text-3xl font-semibold text-neutral-950">Choose a new password</h1>
        <p className="mb-6 text-sm text-neutral-600">
          Use the reset link from your email to update your password.
        </p>
        <StatusMessage status={params?.status} />
        {token ? (
          <form action={resetCustomerPassword} className="grid gap-4">
            <input name="token" type="hidden" value={token} />
            <Field label="New password">
              <NativeInput minLength={8} name="password" required type="password" />
            </Field>
            <Field label="Confirm new password">
              <NativeInput minLength={8} name="passwordConfirm" required type="password" />
            </Field>
            <Button type="submit">Reset password</Button>
          </form>
        ) : (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            This reset link is missing a token. Request a new password reset link.
          </div>
        )}
        <p className="mt-5 text-sm text-neutral-600">
          Need a new link?{' '}
          <Link className="font-medium underline" href="/forgot-password">
            Request password reset
          </Link>
        </p>
      </div>
    </main>
  )
}
