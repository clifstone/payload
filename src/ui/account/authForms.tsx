'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import {
  loginCustomer,
  registerCustomer,
  requestPasswordReset,
} from '@/app/(frontend)/(auth)/actions'
import { StatusMessage } from '@/app/(frontend)/account/components'
import Button from '@/ui/buttons/simple'
import Checkbox from '@/ui/forms/components/checkbox'
import TextInput from '@/ui/forms/components/text-input'
import FormWrapper from '@/ui/forms/formWrapper'

type AuthSwitchAction = {
  label: string
  onClick: () => void
}

type AuthSwitchLink = {
  href: string
  label: string
}

type AuthSwitch = AuthSwitchAction | AuthSwitchLink

const isSwitchAction = (authSwitch: AuthSwitch): authSwitch is AuthSwitchAction => {
  return 'onClick' in authSwitch
}

const AuthSwitchBlock = ({ children, switchTo }: { children: ReactNode; switchTo: AuthSwitch }) => {
  return (
    <div className="border-t pt-4">
      <p className="mb-3 text-sm text-neutral-600">{children}</p>
      {isSwitchAction(switchTo) ? (
        <Button onClick={switchTo.onClick} type="button" variant="outline">
          {switchTo.label}
        </Button>
      ) : (
        <Link className="font-medium underline" href={switchTo.href}>
          {switchTo.label}
        </Link>
      )}
    </div>
  )
}

export const AccountLinks = ({ className = 'grid gap-2 p-4' }: { className?: string }) => {
  return (
    <nav className={className}>
      <Link
        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-neutral-100"
        href="/account"
      >
        Dashboard
      </Link>
      <Link
        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-neutral-100"
        href="/account/profile"
      >
        Profile
      </Link>
      <Link
        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-neutral-100"
        href="/account/addresses"
      >
        Addresses
      </Link>
      <Link
        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-neutral-100"
        href="/account/orders"
      >
        Orders
      </Link>
      <Link
        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-neutral-100"
        href="/account/settings"
      >
        Settings
      </Link>
      <Link
        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-neutral-100"
        href="/logout"
      >
        Log out
      </Link>
    </nav>
  )
}

export const LoginForm = ({
  className = 'grid gap-5 p-4',
  next = '/account',
  status,
  switchToRegister,
}: {
  className?: string
  next?: string
  status?: string
  switchToRegister: AuthSwitch
}) => {
  return (
    <div className={className}>
      <div>
        <h3 className="text-lg font-semibold text-neutral-950">Log in</h3>
        <p className="mt-1 text-sm text-neutral-600">Access your customer account.</p>
      </div>
      <StatusMessage status={status} />
      <FormWrapper action={loginCustomer} className="grid gap-4">
        <input name="next" type="hidden" value={next} />
        <TextInput
          inputMode="email"
          label="Email address"
          name="email"
          placeholder="Email address"
          required
        />
        <TextInput
          inputMode="password"
          label="Password"
          name="password"
          placeholder="Password"
          required
        />
        <Link className="text-sm font-medium underline" href="/forgot-password">
          Forgot password?
        </Link>
        <Button color="primary" type="submit" variant="solid">
          Log in
        </Button>
      </FormWrapper>
      <AuthSwitchBlock switchTo={switchToRegister}>No customer profile yet?</AuthSwitchBlock>
    </div>
  )
}

export const RegisterForm = ({
  className = 'grid gap-5 p-4',
  status,
  switchToLogin,
}: {
  className?: string
  status?: string
  switchToLogin: AuthSwitch
}) => {
  return (
    <div className={className}>
      <div>
        <h3 className="text-lg font-semibold text-neutral-950">Create account</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Start with the basics. You can add addresses later.
        </p>
      </div>
      <StatusMessage status={status} />
      <FormWrapper action={registerCustomer} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="First name" name="firstName" placeholder="First name" required />
          <TextInput label="Last name" name="lastName" placeholder="Last name" required />
        </div>
        <TextInput
          inputMode="email"
          label="Email address"
          name="email"
          placeholder="Email address"
          required
        />
        <TextInput
          inputMode="password"
          label="Password"
          minLength={8}
          name="password"
          placeholder="Password"
          required
        />
        <div className="grid gap-3">
          <Checkbox label="i understand" name="iUnderstand" required />
          <Checkbox label="sign up for my newsletter" name="marketingEmailOptIn" />
        </div>
        <Button color="primary" type="submit" variant="solid">
          Create account
        </Button>
      </FormWrapper>
      <AuthSwitchBlock switchTo={switchToLogin}>Already have an account?</AuthSwitchBlock>
    </div>
  )
}

export const ForgotPasswordForm = ({
  className = 'grid gap-5 p-4',
  status,
  switchToLogin,
}: {
  className?: string
  status?: string
  switchToLogin: AuthSwitch
}) => {
  return (
    <div className={className}>
      <div>
        <h3 className="text-lg font-semibold text-neutral-950">Reset password</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Enter your email and we will send reset instructions if an account exists.
        </p>
      </div>
      <StatusMessage status={status} />
      <FormWrapper action={requestPasswordReset} className="grid gap-4">
        <TextInput
          inputMode="email"
          label="Email address"
          name="email"
          placeholder="Email address"
          required
        />
        <Button color="primary" type="submit" variant="solid">
          Send reset link
        </Button>
      </FormWrapper>
      <AuthSwitchBlock switchTo={switchToLogin}>Remembered it?</AuthSwitchBlock>
    </div>
  )
}
