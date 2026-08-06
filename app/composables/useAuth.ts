import { authClient } from '@/lib/auth-client'

/**
 * Single source of session state for the UI. Shared via useState so every
 * component reads the same value and one sign-out updates all of them.
 */
export function useAuth() {
  const session = useState<{ user?: { name: string; email: string; image?: string | null } } | null>(
    'auth-session',
    () => null
  )

  async function refresh() {
    session.value = await useRequestFetch()('/api/auth/get-session').catch(() => null)
  }

  async function signOut() {
    await authClient.signOut()
    session.value = null
    await navigateTo('/login')
  }

  return { session, user: computed(() => session.value?.user ?? null), refresh, signOut }
}
