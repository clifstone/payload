'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { loginCustomer, registerCustomer } from '@/app/(frontend)/(auth)/actions'
import { Button } from '@/components/ui/button'
import { useDrawer } from '../../context/drawers'
import Wrapper from '../wrapper'

type DrawerMode = 'login' | 'register'
type AuthState = 'checking' | 'disabled' | 'signed-in' | 'signed-out'

const inputClass =
  'h-10 rounded-md border border-neutral-300 px-3 text-sm outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200'

const fieldClass = 'grid gap-2 text-sm font-medium text-neutral-800'

const AccountLinks = () => {
  return (
    <nav className="grid gap-2 p-4">
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

const LoginForm = ({ onRegister }: { onRegister: () => void }) => {
  return (
    <div className="grid gap-5 p-4">
      <div>
        <h3 className="text-lg font-semibold text-neutral-950">Log in</h3>
        <p className="mt-1 text-sm text-neutral-600">Access your customer account.</p>
      </div>
      <form action={loginCustomer} className="grid gap-4">
        <input name="next" type="hidden" value="/account" />
        <label className={fieldClass}>
          Email address
          <input className={inputClass} name="email" required type="email" />
        </label>
        <label className={fieldClass}>
          Password
          <input className={inputClass} name="password" required type="password" />
        </label>
        <Link className="text-sm font-medium underline" href="/forgot-password">
          Forgot password?
        </Link>
        <Button type="submit">Log in</Button>
      </form>
      <div className="border-t pt-4">
        <p className="mb-3 text-sm text-neutral-600">No customer profile yet?</p>
        <Button onClick={onRegister} type="button" variant="outline">
          Create account
        </Button>
      </div>
    </div>
  )
}

const RegisterForm = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="grid gap-5 p-4">
      <div>
        <h3 className="text-lg font-semibold text-neutral-950">Create account</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Start with the basics. You can add addresses later.
        </p>
      </div>
      <form action={registerCustomer} className="grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={fieldClass}>
            First name
            <input className={inputClass} name="firstName" required />
          </label>
          <label className={fieldClass}>
            Last name
            <input className={inputClass} name="lastName" required />
          </label>
        </div>
        <label className={fieldClass}>
          Email address
          <input className={inputClass} name="email" required type="email" />
        </label>
        <label className={fieldClass}>
          Password
          <input className={inputClass} minLength={8} name="password" required type="password" />
        </label>
        <Button type="submit">Create account</Button>
      </form>
      <div className="border-t pt-4">
        <p className="mb-3 text-sm text-neutral-600">Already have an account?</p>
        <Button onClick={onLogin} type="button" variant="outline">
          Log in
        </Button>
      </div>
    </div>
  )
}

const Account = () => {
  const { drawers } = useDrawer()
  const drawerName = 'account'
  const theTitle = `Your Account`
  const isOpen = drawers[drawerName]
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [mode, setMode] = useState<DrawerMode>('login')

  useEffect(() => {
    if (!isOpen) return

    let cancelled = false

    setAuthState('checking')

    fetch('/api/current-customer', {
      cache: 'no-store',
      credentials: 'same-origin',
    })
      .then((response) => {
        if (cancelled) return

        if (response.ok) {
          setAuthState('signed-in')
          return
        }

        setAuthState(response.status === 403 ? 'disabled' : 'signed-out')
      })
      .catch(() => {
        if (!cancelled) setAuthState('signed-out')
      })

    return () => {
      cancelled = true
    }
  }, [isOpen])

  return (
    <Wrapper name={drawerName} title={theTitle} isOpen={isOpen} direction={'right'}>
      {authState === 'checking' && (
        <div className="p-4 text-sm text-neutral-600">Checking account status...</div>
      )}
      {authState === 'signed-in' && <AccountLinks />}
      {authState === 'signed-out' &&
        (mode === 'login' ? (
          <LoginForm onRegister={() => setMode('register')} />
        ) : (
          <RegisterForm onLogin={() => setMode('login')} />
        ))}
      {authState === 'disabled' && (
        <div className="grid gap-4 p-4 text-sm text-neutral-700">
          <p>This account is disabled. Please contact support for help accessing your account.</p>
          <Button asChild variant="outline">
            <Link href="/logout">Log out</Link>
          </Button>
        </div>
      )}
    </Wrapper>
  )
}

export default Account
