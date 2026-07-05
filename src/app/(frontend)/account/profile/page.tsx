import { Button } from '@/components/ui/button'
import { getCurrentCustomer } from '@/utilities/getCurrentCustomer'
import { Field, NativeInput, SectionHeader, StatusMessage } from '../components'
import { updateProfile } from '../actions'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams?: Promise<{
    status?: string
  }>
}

export default async function ProfilePage({ searchParams }: PageProps) {
  const { customer } = await getCurrentCustomer({
    disabledRedirect: '/account-disabled',
    nullUserRedirect: '/login?next=/account/profile',
  })
  const status = (await searchParams)?.status

  if (!customer) return null

  return (
    <div>
      <SectionHeader eyebrow="Account" title="Profile" />
      <StatusMessage status={status} />

      <form action={updateProfile} className="grid max-w-2xl gap-5 rounded-lg border p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name">
            <NativeInput defaultValue={customer.firstName} name="firstName" required />
          </Field>
          <Field label="Last name">
            <NativeInput defaultValue={customer.lastName} name="lastName" required />
          </Field>
        </div>
        <Field label="Email address">
          <NativeInput defaultValue={customer.email} name="email" required type="email" />
        </Field>
        <Field label="Phone number">
          <NativeInput defaultValue={customer.phone || ''} name="phone" type="tel" />
        </Field>
        <div>
          <Button type="submit">Save profile</Button>
        </div>
      </form>
    </div>
  )
}
