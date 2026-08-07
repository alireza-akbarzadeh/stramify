import { and, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../../db/client'
import { follows } from '../../../db/schema'
import { requireUser } from '../../../utils/session'
import { readChannelSummary } from '../../../utils/channels'
import type { ChannelSummary } from '#shared/types/watch'

const paramsSchema = z.object({ name: z.string().min(1).max(100) })

/**
 * Follow or unfollow a channel, returning the fresh summary so the button and
 * the follower count update from one round trip.
 *
 * The insert relies on `follows_user_channel_unique` for idempotency — a
 * double-click can't create two rows.
 */
export default defineEventHandler(async (event): Promise<ChannelSummary> => {
  const parsed = paramsSchema.safeParse({ name: getRouterParam(event, 'name') })
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid channel name' })
  }

  const user = await requireUser(event)
  const name = parsed.data.name
  const matchesChannel = sql`lower(${follows.channel}) = lower(${name})`

  const existing = await db
    .select({ id: follows.id })
    .from(follows)
    .where(and(eq(follows.userId, user.id), matchesChannel))
    .limit(1)

  if (existing.length) {
    await db.delete(follows).where(and(eq(follows.userId, user.id), matchesChannel))
  } else {
    await db
      .insert(follows)
      .values({ id: `follow-${crypto.randomUUID()}`, userId: user.id, channel: name })
      .onConflictDoNothing()
  }

  return readChannelSummary(name, user.id)
})
