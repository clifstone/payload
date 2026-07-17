'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { AccountLinks, LoginForm, RegisterForm } from '@/ui/account/authForms'
import { useDrawer } from '../../context/drawers'
import Wrapper from '../wrapper'

type DrawerMode = 'login' | 'register'
type AuthState = 'checking' | 'disabled' | 'signed-in' | 'signed-out'

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
          <LoginForm
            switchToRegister={{ label: 'Create account', onClick: () => setMode('register') }}
          />
        ) : (
          <RegisterForm switchToLogin={{ label: 'Log in', onClick: () => setMode('login') }} />
        ))}
      {authState === 'disabled' && (
        <div className="grid gap-4 p-4 text-sm text-neutral-700">
          <p>This account is disabled. Please contact support for help accessing your account.</p>
          <Link className="w-fit rounded-md border px-4 py-2 text-sm font-medium" href="/logout">
            Log out
          </Link>
        </div>
      )}
    </Wrapper>
  )
}

export default Account
