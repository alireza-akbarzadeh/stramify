import { and, count, eq, sql } from 'drizzle-orm'
import { db } from '../db/client'
import { clips, follows } from '../db/schema'
import { formatCount } from './format'
import type { ChannelSummary } from '#shared/types/watch'

/**
 * Channel header data, derived rather than stored — there is no `channels`
 * table (ADR-014). Identity is the handle itself, matched case-insensitively
 * so `/watch/viper_squadron` and `/watch/Viper_Squadron` agree on who they
 * mean, exactly like `/api/discovery/live/[streamer]`.
 */
export async function readChannelSummary(
  name: string,
  userId: string | null
): Promise<ChannelSummary> {
  const lower = sql`lower(${follows.channel})`
  const [followers, clipCount, mine] = await Promise.all([
    db
      .select({ total: count(follows.id) })
      .from(follows)
      .where(sql`${lower} = lower(${name})`),
    db
      .select({ total: count(clips.id) })
      .from(clips)
      .where(sql`lower(${clips.creator}) = lower(${name})`),
    userId
      ? db
          .select({ id: follows.id })
          .from(follows)
          .where(and(eq(follows.userId, userId), sql`${lower} = lower(${name})`))
          .limit(1)
      : Promise.resolve([])
  ])

  return {
    name,
    followers: formatCount(followers[0]?.total ?? 0),
    clipCount: clipCount[0]?.total ?? 0,
    isFollowing: mine.length > 0
  }
}
