import { getCurrentCustomer } from '@/utilities/getCurrentCustomer'
import { AccountShell, VerificationBanner } from './components'

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const { customer } = await getCurrentCustomer({
    disabledRedirect: '/account-disabled',
    nullUserRedirect: '/login?next=/account',
  })

  return (
    <AccountShell>
      <VerificationBanner verified={customer?.emailVerified} />
      {children}
    </AccountShell>
  )
}
