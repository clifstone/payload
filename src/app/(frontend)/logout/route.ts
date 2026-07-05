import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(): Promise<Response> {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')
  redirect('/login?status=logged-out')
}
