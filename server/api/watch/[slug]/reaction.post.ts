import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../../db/client'
import { reactions } from '../../../db/schema'
import { resolveWatchTarget } from '../../../utils/watch'
import { requireUser } from '../../../utils/session'
import { readReactionSummary } from '../../../utils/reactions'
import type { ReactionSummary } from '#shared/types/watch'

const paramsSchema = z.object({ slug: z.string().min(1).max(200) })
const bodySchema = z.object({ value: z.enum(['like', 'dislike']) })

/**
 * Toggle the caller's reaction and return fresh totals.
 *
 * Clicking the reaction you already have clears it; clicking the other one
 * switches. The switch is an upsert on the unique `(user_id, target_id)`
 * constraint rather than delete-then-insert, so two fast clicks can't leave a
 * user holding both a like and a dislike.
 */
export default defineEventHandler(async (event): Promise<ReactionSummary> => {
  const parsed = paramsSchema.safeParse({ slug: getRouterParam(event, 'slug') })
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid watch slug' })
  }

  const user = await requireUser(event)
  const body = bodySchema.safeParse(await readBody(event))
  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Reaction must be like or dislike' })
  }

  const resolved = await resolveWatchTarget(parsed.data.slug)
  if (!resolved) {
    throw createError({ statusCode: 404, statusMessage: 'That video is not available' })
  }

  const targetId = resolved.row.id
  const existing = await db
    .select({ value: reactions.value })
    .from(reactions)
    .where(and(eq(reactions.targetId, targetId), eq(reactions.userId, user.id)))
    .limit(1)

  if (existing[0]?.value === body.data.value) {
    await db
      .delete(reactions)
      .where(and(eq(reactions.targetId, targetId), eq(reactions.userId, user.id)))
  } else {
    await db
      .insert(reactions)
      .values({
        id: `reaction-${crypto.randomUUID()}`,
        userId: user.id,
        targetId,
        targetKind: resolved.kind,
        value: body.data.value
      })
      .onConflictDoUpdate({
        target: [reactions.userId, reactions.targetId],
        set: { value: body.data.value }
      })
  }

  return readReactionSummary(targetId, user.id)
})
