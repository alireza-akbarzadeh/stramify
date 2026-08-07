import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../../../db/client'
import { comments } from '../../../../db/schema'
import { resolveWatchTarget } from '../../../../utils/watch'
import { findClipComment } from '../../../../utils/comments'
import { requireUser } from '../../../../utils/session'

const paramsSchema = z.object({
  slug: z.string().min(1).max(200),
  id: z.string().min(1).max(200)
})

/**
 * Delete your own comment. Replies go with it via the `parent_id` cascade.
 *
 * Ownership is checked against the stored `user_id`, not against anything the
 * client sent (CLAUDE.md §5). A comment you don't own is a 403 rather than a
 * 404: the row demonstrably exists on this clip, and pretending otherwise
 * would just make a real bug harder to read in the logs.
 */
export default defineEventHandler(async (event) => {
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
  if (row.userId !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'You can only delete your own comments' })
  }

  // Replies aren't reached by the FK cascade — `parent_id` is a bare text
  // column by design (see the schema note), so they're removed explicitly.
  await db.delete(comments).where(eq(comments.parentId, row.id))
  await db.delete(comments).where(eq(comments.id, row.id))

  return { ok: true as const }
})
