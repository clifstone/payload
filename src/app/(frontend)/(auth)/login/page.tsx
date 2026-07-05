import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Field, NativeInput, StatusMessage } from '../../account/components'
import { loginCustomer } from '../actions'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams?: Promise<{
    next?: string
    status?: string
  }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams
  const next = params?.next || '/account'

  return (
    <main className="mx-auto grid min-h-[70dvh] w-full max-w-md content-center px-4 py-12">
      <div className="rounded-lg border p-6">
        <h1 className="mb-2 text-3xl font-semibold text-neutral-950">Log in</h1>
        <p className="mb-6 text-sm text-neutral-600">Access your customer account.</p>
        <StatusMessage status={params?.status} />
        <form action={loginCustomer} className="grid gap-4">
          <input name="next" type="hidden" value={next} />
          <Field label="Email address">
            <NativeInput name="email" required type="email" />
          </Field>
          <Field label="Password">
            <NativeInput name="password" required type="password" />
          </Field>
          <Link className="text-sm font-medium underline" href="/forgot-password">
            Forgot password?
          </Link>
          <Button type="submit">Log in</Button>
        </form>
        <p className="mt-5 text-sm text-neutral-600">
          New customer?{' '}
          <Link className="font-medium underline" href="/register">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  )
}
