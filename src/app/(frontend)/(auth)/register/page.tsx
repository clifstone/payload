import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Field, NativeInput, StatusMessage } from '../../account/components'
import { registerCustomer } from '../actions'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams?: Promise<{
    status?: string
  }>
}

export default async function RegisterPage({ searchParams }: PageProps) {
  const status = (await searchParams)?.status

  return (
    <main className="mx-auto grid min-h-[70dvh] w-full max-w-md content-center px-4 py-12">
      <div className="rounded-lg border p-6">
        <h1 className="mb-2 text-3xl font-semibold text-neutral-950">Create account</h1>
        <p className="mb-6 text-sm text-neutral-600">
          Start with the basics. You can add addresses and preferences later.
        </p>
        <StatusMessage status={status} />
        <form action={registerCustomer} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name">
              <NativeInput name="firstName" required />
            </Field>
            <Field label="Last name">
              <NativeInput name="lastName" required />
            </Field>
          </div>
          <Field label="Email address">
            <NativeInput name="email" required type="email" />
          </Field>
          <Field label="Password">
            <NativeInput minLength={8} name="password" required type="password" />
          </Field>
          <Button type="submit">Create account</Button>
        </form>
        <p className="mt-5 text-sm text-neutral-600">
          Already registered?{' '}
          <Link className="font-medium underline" href="/login">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
