import { LoginForm } from '@/ui/account/authForms'

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
        <LoginForm
          className="grid gap-5"
          next={next}
          status={params?.status}
          switchToRegister={{ href: '/register', label: 'Create an account' }}
        />
      </div>
    </main>
  )
}
