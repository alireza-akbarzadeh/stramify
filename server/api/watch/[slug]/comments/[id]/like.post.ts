import { and, count, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../../../../db/client'
import { commentLikes } from '../../../../../db/schema'
import { resolveWatchTarget } from '../../../../../utils/watch'
import { findClipComment } from '../../../../../utils/comments'
import { requireUser } from '../../../../../utils/session'

const paramsSchema = z.object({
  slug: z.string().min(1).max(200),
  id: z.string().min(1).max(200)
})

/** What the button needs to re-render: the new total and the caller's state. */
export interface CommentLikeResult {
  likes: number
  likedByMe: boolean
}

/**
 * Toggle your like on a comment and return its fresh total.
 *
 * The insert upserts on the unique `(user_id, comment_id)` constraint, so a
 * double-click can't create two rows. The returned total re-adds the seeded
 * baseline, matching what `readClipComments` renders — otherwise liking a
 * seeded comment would visibly drop its count to 1.
 */
export default defineEventHandler(async (event): Promise<CommentLikeResult> => {
  const parsed = paramsSchema.safeParse({
    slug: getRouterParam(event, 'slug'),
    id: getRouterParam(event, 'id')
  })
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid comment' })
  }

  const user = await requireUser(event)
  const resolved = await resolveWatchTarget(parsed.data.slug)
  if (!resolved || resolved.kind !== 'clip') {
    throw createError({ statusCode: 404, statusMessage: 'That video is not available' })
  }

  const row = await findClipComment(resolved.row.id, parsed.data.id)
  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'That comment no longer exists' })
  }

  const owns = and(eq(commentLikes.commentId, row.id), eq(commentLikes.userId, user.id))
  const [existing] = await db.select({ id: commentLikes.id }).from(commentLikes).where(owns).limit(1)

  if (existing) {
    await db.delete(commentLikes).where(owns)
  } else {
    await db
      .insert(commentLikes)
      .values({
        id: `comment-like-${crypto.randomUUID()}`,
        commentId: row.id,
        userId: user.id
      })
      .onConflictDoNothing({ target: [commentLikes.userId, commentLikes.commentId] })
  }

  const [totals] = await db
    .select({ total: count() })
    .from(commentLikes)
    .where(eq(commentLikes.commentId, row.id))

  return { likes: row.likes + (totals?.total ?? 0), likedByMe: !existing }
})
