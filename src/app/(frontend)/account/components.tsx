import Link from 'next/link'

import type { Customer } from '@/payload-types'
import { Button } from '@/components/ui/button'
import { formatDateTime } from '@/utilities/formatDateTime'

export type AccountAddress = NonNullable<Customer['addresses']>[number] & {
  company?: string | null
}

export const accountNavItems = [
  { href: '/account', label: 'Dashboard' },
  { href: '/account/profile', label: 'Profile' },
  { href: '/account/addresses', label: 'Addresses' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/settings', label: 'Settings' },
  { href: '/logout', label: 'Log out' },
]

export const AccountShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:py-14">
      <aside className="md:w-56 md:shrink-0">
        <nav className="flex gap-2 overflow-x-auto border-b pb-3 md:flex-col md:border-b-0 md:border-r md:pb-0 md:pr-4">
          {accountNavItems.map((item) => (
            <Link
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}

export const SectionHeader = ({
  action,
  eyebrow,
  title,
}: {
  action?: React.ReactNode
  eyebrow?: string
  title: string
}) => {
  return (
    <div className="mb-6 flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-1 text-sm font-medium text-neutral-500">{eyebrow}</p>}
        <h1 className="text-3xl font-semibold tracking-normal text-neutral-950">{title}</h1>
      </div>
      {action}
    </div>
  )
}

export const VerificationBanner = ({ verified }: { verified?: boolean | null }) => {
  if (verified) return null

  return (
    <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p>Please verify your email address to keep your account secure.</p>
        <Link className="font-medium underline" href="/account/settings">
          Resend verification
        </Link>
      </div>
    </div>
  )
}

export const StatusMessage = ({ status }: { status?: string }) => {
  if (!status) return null

  const messages: Record<string, { tone: 'error' | 'success'; text: string }> = {
    'account-exists': {
      text: 'An account already exists for that email address.',
      tone: 'error',
    },
    'customer-profile-missing': {
      text: 'We could not find the customer profile for this login.',
      tone: 'error',
    },
    'invalid-login': {
      text: 'The email or password you entered is not correct.',
      tone: 'error',
    },
    'email-already-verified': {
      text: 'Your email address is already verified.',
      tone: 'success',
    },
    'missing-required': {
      text: 'Please complete all required fields.',
      tone: 'error',
    },
    'password-confirmation-invalid': {
      text: 'Please enter a valid password and matching confirmation.',
      tone: 'error',
    },
    'password-current-invalid': {
      text: 'Your current password is not correct.',
      tone: 'error',
    },
    'password-invalid': {
      text: 'Please enter a valid password and matching confirmation.',
      tone: 'error',
    },
    'password-updated': {
      text: 'Your password has been updated.',
      tone: 'success',
    },
    'registered-login-required': {
      text: 'Your account was created. Please log in to continue.',
      tone: 'success',
    },
    'registration-failed': {
      text: 'We could not finish creating the account. Please try again.',
      tone: 'error',
    },
    'reset-token-invalid': {
      text: 'That password reset link is invalid or expired.',
      tone: 'error',
    },
    'password-reset': {
      text: 'Your password has been reset.',
      tone: 'success',
    },
    'password-reset-sent': {
      text: 'If an account exists for that email, a password reset link has been sent.',
      tone: 'success',
    },
    'verification-email-sent': {
      text: 'Verification email sent. Check the development logs for the placeholder email link.',
      tone: 'success',
    },
  }

  const message = messages[status] || {
    text: status
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    tone: 'success' as const,
  }

  const className =
    message.tone === 'error'
      ? 'mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800'
      : 'mb-5 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800'

  return <div className={className}>{message.text}</div>
}

export const Field = ({ children, label }: { children: React.ReactNode; label: string }) => {
  return (
    <label className="grid gap-2 text-sm font-medium text-neutral-800">
      {label}
      {children}
    </label>
  )
}

export const NativeInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      {...props}
      className="h-10 rounded-md border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200"
    />
  )
}

export const NativeCheckbox = ({
  children,
  name,
  value,
}: {
  children: React.ReactNode
  name: string
  value?: boolean | null
}) => {
  return (
    <label className="flex items-center gap-3 text-sm font-medium text-neutral-800">
      <input
        className="size-4 rounded border-neutral-300"
        defaultChecked={Boolean(value)}
        name={name}
        type="checkbox"
      />
      {children}
    </label>
  )
}

export const AddressBlock = ({ address }: { address?: AccountAddress | null }) => {
  if (!address) {
    return <p className="text-sm text-neutral-500">No address saved yet.</p>
  }

  return (
    <address className="space-y-1 text-sm not-italic text-neutral-700">
      <p className="font-medium text-neutral-950">
        {address.firstName} {address.lastName}
      </p>
      {address.company && <p>{address.company}</p>}
      <p>{address.line1}</p>
      {address.line2 && <p>{address.line2}</p>}
      <p>
        {address.city}, {address.stateProvince} {address.postalCode}
      </p>
      <p>{address.country}</p>
      {address.phone && <p>{address.phone}</p>}
    </address>
  )
}

export const formatMoney = (amount?: number | null, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    currency,
    style: 'currency',
  }).format(amount || 0)
}

export const formatOrderDate = (timestamp?: string | null) => {
  return timestamp ? formatDateTime(timestamp) : ''
}

export const ShortcutButton = ({ href, label }: { href: string; label: string }) => (
  <Button asChild variant="outline">
    <Link href={href}>{label}</Link>
  </Button>
)
