import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function AccountDisabledPage() {
  return (
    <main className="mx-auto grid min-h-[70dvh] w-full max-w-xl content-center px-4 py-12">
      <div className="rounded-lg border p-6">
        <h1 className="mb-3 text-3xl font-semibold text-neutral-950">Account disabled</h1>
        <p className="mb-6 text-sm text-neutral-600">
          This customer account is currently disabled. The account records have not been deleted.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Return to site</Link>
        </Button>
      </div>
    </main>
  )
}
