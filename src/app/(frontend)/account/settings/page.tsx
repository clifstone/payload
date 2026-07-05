import { Button } from '@/components/ui/button'
import { getCurrentCustomer } from '@/utilities/getCurrentCustomer'
import { Field, NativeCheckbox, NativeInput, SectionHeader, StatusMessage } from '../components'
import { changePassword, resendVerificationEmail, updatePreferences } from '../actions'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams?: Promise<{
    status?: string
  }>
}

export default async function SettingsPage({ searchParams }: PageProps) {
  const { customer } = await getCurrentCustomer({
    disabledRedirect: '/account-disabled',
    nullUserRedirect: '/login?next=/account/settings',
  })
  const status = (await searchParams)?.status

  if (!customer) return null

  return (
    <div>
      <SectionHeader eyebrow="Account" title="Settings" />
      <StatusMessage status={status} />

      <div className="grid gap-6">
        <section className="rounded-lg border p-5">
          <h2 className="mb-2 text-lg font-semibold text-neutral-950">Email verification</h2>
          <p className="mb-4 text-sm text-neutral-600">
            Status:{' '}
            <span className="font-medium">
              {customer.emailVerified ? 'Verified' : 'Verification pending'}
            </span>
          </p>
          {!customer.emailVerified && (
            <form action={resendVerificationEmail}>
              <Button type="submit" variant="outline">
                Resend verification email
              </Button>
            </form>
          )}
        </section>

        <section className="rounded-lg border p-5">
          <h2 className="mb-4 text-lg font-semibold text-neutral-950">Communication</h2>
          <form action={updatePreferences} className="grid gap-4">
            <NativeCheckbox name="smsOptIn" value={customer.smsOptIn}>
              SMS updates
            </NativeCheckbox>
            <NativeCheckbox name="marketingEmailOptIn" value={customer.marketingEmailOptIn}>
              Marketing emails
            </NativeCheckbox>
            <div>
              <Button type="submit">Save preferences</Button>
            </div>
          </form>
        </section>

        <section className="rounded-lg border p-5">
          <h2 className="mb-4 text-lg font-semibold text-neutral-950">Change password</h2>
          <form action={changePassword} className="grid max-w-xl gap-4">
            <Field label="Current password">
              <NativeInput name="currentPassword" required type="password" />
            </Field>
            <Field label="New password">
              <NativeInput minLength={8} name="newPassword" required type="password" />
            </Field>
            <Field label="Confirm new password">
              <NativeInput minLength={8} name="newPasswordConfirm" required type="password" />
            </Field>
            <div>
              <Button type="submit">Update password</Button>
            </div>
          </form>
        </section>

        <section className="rounded-lg border p-5">
          <h2 className="mb-2 text-lg font-semibold text-neutral-950">Privacy</h2>
          <p className="text-sm text-neutral-600">
            Account status: <span className="font-medium capitalize">{customer.accountStatus}</span>
          </p>
        </section>
      </div>
    </div>
  )
}
