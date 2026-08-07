import type { H3Event } from 'h3'
import { auth } from './auth'

export interface SessionUser {
  id: string
  name: string
  email: string
  image?: string | null
}

/** The signed-in user, or `null`. Never throws — use for optional personalization. */
export async function getSessionUser(event: H3Event): Promise<SessionUser | null> {
  const session = await auth.api
    .getSession({ headers: event.headers })
    .catch(() => null)
  return (session?.user as SessionUser | undefined) ?? null
}

/**
 * The signed-in user, or a 401. Every write endpoint goes through this — the
 * authorization check lives server-side, not in whether the UI rendered a
 * button (CLAUDE.md §5).
 */
export async function requireUser(event: H3Event): Promise<SessionUser> {
  const user = await getSessionUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'You need to be signed in' })
  }
  return user
}
