import { authClient } from '@/lib/auth-client'

/**
 * Route guard for signed-in-only pages. This is a UX redirect only — the real
 * authorization boundary is the server-side session check in the API routes
 * (CLAUDE.md rule 5), never this middleware.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.getSession()
  if (!session) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
