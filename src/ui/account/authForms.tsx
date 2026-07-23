'use client'

import Link from 'next/link'
import { useActionState, type ReactNode } from 'react'

import {
  loginCustomer,
  registerCustomer,
  requestPasswordReset,
  requestPasswordResetInPlace,
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
    <div className="derpie flex flex-col gap-4 border rounded-lg p-4">
      <div className="flex w-full">{children}</div>
      {isSwitchAction(switchTo) ? (
        <Button
          type="button"
          size="form"
          onClick={switchTo.onClick}
          variant="outline"
          color="primary"
        >
          {switchTo.label}
        </Button>
      ) : (
        <Link
          className="font-medium underline"
          href={switchTo.href}
        >
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

export const Wrap = ({ children }: { children: ReactNode }) => {
  return <section className="flex flex-col w-full">{children}</section>
}

export const Header = ({
  headline = 'headline',
  subheadline = 'subheadline',
}: {
  headline: string
  subheadline: string
}) => {
  return (
    <section className="flex flex-col w-full">
      <header className="flex flex-col gap-1 p-4">
        <h3 className="text-lg font-semibold">{headline}</h3>
        <span className="">{subheadline}</span>
      </header>
    </section>
  )
}

export const Bod = ({ children }: { children: ReactNode }) => {
  return <div className="flex-grow flex flex-col gap-8 p-4">{children}</div>
}

export const LoginForm = ({
  next = '/account',
  status,
  switchToForgotPassword = { href: '/forgot-password', label: 'Forgot Password?' },
  switchToRegister,
}: {
  className?: string
  next?: string
  status?: string
  switchToForgotPassword?: AuthSwitch
  switchToRegister: AuthSwitch
}) => {
  return (
    <Wrap>
      <Header
        headline="Log In"
        subheadline="Access your account."
      />
      <Bod>
        <StatusMessage status={status} />
        <FormWrapper action={loginCustomer}>
          <div className="flex flex-col gap-6">
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
          </div>
          <Button
            size="form"
            color="primary"
            type="submit"
            variant="solid"
          >
            Log in
          </Button>
          <input
            name="next"
            type="hidden"
            value={next}
          />
        </FormWrapper>
        <div className="flex gap-4 justify-center">
          {isSwitchAction(switchToForgotPassword) ? (
            <Button
              color="primary"
              onClick={switchToForgotPassword.onClick}
              type="button"
            >
              {switchToForgotPassword.label}
            </Button>
          ) : (
            <Link
              className="font-medium underline"
              href={switchToForgotPassword.href}
            >
              {switchToForgotPassword.label}
            </Link>
          )}
        </div>
        <AuthSwitchBlock switchTo={switchToRegister}>
          <span className="text-sm block text-center w-full">No customer profile yet?</span>
        </AuthSwitchBlock>
      </Bod>
    </Wrap>
  )
}

export const RegisterForm = ({
  className,
  status,
  switchToLogin,
}: {
  className?: string
  status?: string
  switchToLogin: AuthSwitch
}) => {
  return (
    <Wrap>
      <Header
        headline="Create account"
        subheadline="Start with the basics. You can add addresses later."
      />
      <Bod>
        <StatusMessage status={status} />
        <FormWrapper
          action={registerCustomer}
          className="grid gap-4"
        >
          <div className="flex flex-col gap-6">
            <TextInput
              label="First name"
              name="firstName"
              placeholder="First name"
              required
            />
            <TextInput
              label="Last name"
              name="lastName"
              placeholder="Last name"
              required
            />
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
          </div>
          <div className="">
            <Checkbox
              label="i understand the terms and conditions"
              name="iUnderstand"
              required
            />
          </div>
          <div className="bg-neutral-50 border-2 border-dashed rounded-lg p-4">
            <Checkbox
              label="sign up for my newsletter"
              name="marketingEmailOptIn"
            />
          </div>
        </FormWrapper>
        <AuthSwitchBlock switchTo={switchToLogin}>Already have an account?</AuthSwitchBlock>
      </Bod>
    </Wrap>
  )
}

export const ForgotPasswordForm = ({
  className,
  inPlace = false,
  status,
  switchToLogin,
}: {
  className?: string
  inPlace?: boolean
  status?: string
  switchToLogin: AuthSwitch
}) => {
  const [inPlaceStatus, inPlaceAction, isPending] = useActionState(
    requestPasswordResetInPlace,
    undefined,
  )

  return (
    <>
      <Wrap>
        <Header
          headline="Send Password Reset Instructions"
          subheadline="If you got an account, we'll find it by email and send instructions."
        />
        <Bod>
          <FormWrapper action={inPlace ? inPlaceAction : requestPasswordReset}>
            <div className="flex flex-col gap-6">
              <TextInput
                inputMode="email"
                label="Email address"
                name="email"
                placeholder="Email address"
                required
              />
              <Button
                loading={isPending}
                size="form"
                color="primary"
                type="submit"
                variant="solid"
              >
                Send reset link
              </Button>
            </div>
          </FormWrapper>
          <AuthSwitchBlock switchTo={switchToLogin}>Remembered it?</AuthSwitchBlock>
        </Bod>
      </Wrap>
    </>
  )
}
