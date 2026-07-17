import { ForgotPasswordForm } from '@/ui/account/authForms'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams?: Promise<{
    status?: string
  }>
}

export default async function ForgotPasswordPage({ searchParams }: PageProps) {
  const status = (await searchParams)?.status

  return (
    <main className="mx-auto grid min-h-[70dvh] w-full max-w-md content-center px-4 py-12">
      <div className="rounded-lg border p-6">
        <ForgotPasswordForm
          className="grid gap-5"
          status={status}
          switchToLogin={{ href: '/login', label: 'Log in' }}
        />
      </div>
    </main>
  )
}
