import { authClient } from '@/lib/auth-client'

export interface SessionUser {
  name: string
  email: string
  image?: string | null
  emailVerified?: boolean
  twoFactorEnabled?: boolean | null
}

/**
 * Single source of session state for the UI. Shared via useState so every
 * component reads the same value and one sign-out updates all of them.
 */
export function useAuth() {
  const session = useState<{ user?: SessionUser } | null>('auth-session', () => null)

  async function refresh() {
    // Cast: the generated type for this catch-all auth route is the generic
    // fetch envelope, not better-auth's session payload.
    const result = (await useRequestFetch()('/api/auth/get-session').catch(() => null)) as
      | { user?: SessionUser }
      | null
    session.value = result?.user ? result : null
  }

  async function signOut() {
    await authClient.signOut()
    session.value = null
    await navigateTo('/login')
  }

  return { session, user: computed(() => session.value?.user ?? null), refresh, signOut }
}
