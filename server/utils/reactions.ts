import { and, count, eq } from 'drizzle-orm'
import { db } from '../db/client'
import { reactions } from '../db/schema'
import type { ReactionSummary, ReactionValue } from '#shared/types/watch'

/**
 * Like/dislike totals for one target, plus what `userId` picked (null when
 * signed out). One grouped query for the counts — the table is indexed by the
 * unique `(user_id, target_id)` pair, so the caller's own row is a point read.
 */
export async function readReactionSummary(
  targetId: string,
  userId: string | null
): Promise<ReactionSummary> {
  const [totals, mine] = await Promise.all([
    db
      .select({ value: reactions.value, total: count(reactions.id) })
      .from(reactions)
      .where(eq(reactions.targetId, targetId))
      .groupBy(reactions.value),
    userId
      ? db
          .select({ value: reactions.value })
          .from(reactions)
          .where(and(eq(reactions.targetId, targetId), eq(reactions.userId, userId)))
          .limit(1)
      : Promise.resolve([])
  ])

  const find = (value: ReactionValue) => totals.find((row) => row.value === value)?.total ?? 0
  return { likes: find('like'), dislikes: find('dislike'), mine: mine[0]?.value ?? null }
}
