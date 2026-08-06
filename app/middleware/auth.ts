/**
 * Route guard for signed-in-only pages. This is a UX redirect only — the real
 * authorization boundary is the server-side session check in the API routes
 * (CLAUDE.md rule 5), never this middleware.
 *
 * Uses useRequestFetch() rather than the better-auth Vue client: during SSR
 * the client's relative URL has no origin to resolve against, and cookies
 * from the incoming request need forwarding for the session to be visible.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const session = await useRequestFetch()('/api/auth/get-session').catch(() => null)
  if (!session) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
