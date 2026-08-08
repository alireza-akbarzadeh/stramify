import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { accountLinks } from '@/utils/nav'

/**
 * The session bits every account surface needs: who's signed in, where the
 * menu can take them, and how to leave. `UserMenu` (public header + app top
 * bar) and `SidebarUserMenu` (sidebar footer) are three renderings of this one
 * piece of state — the links themselves live in `utils/nav.ts` with the rest
 * of the app's navigation, where a test can assert none of them 404.
 */
export function useAccountMenu() {
  const auth = useAuthStore()
  const { user } = storeToRefs(auth)

  const initial = computed(() =>
    (user.value?.name || user.value?.email || '?').charAt(0).toUpperCase()
  )

  return { user, initial, signOut: auth.signOut, links: accountLinks }
}
