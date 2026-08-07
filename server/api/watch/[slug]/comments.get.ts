import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../../db/client'
import { comments } from '../../../db/schema'
import { resolveWatchTarget } from '../../../utils/watch'
import { formatAge } from '../../../utils/format'
import type { WatchComment } from '#shared/types/watch'

const paramsSchema = z.object({ slug: z.string().min(1).max(200) })
const querySchema = z.object({ sort: z.enum(['new', 'top']).default('top') })

type CommentRow = typeof comments.$inferSelect

function toComment(row: CommentRow): WatchComment {
  return {
    id: row.id,
    authorName: row.authorName,
    authorImage: row.authorImage,
    body: row.body,
    likes: row.likes,
    age: formatAge(row.createdAt),
    replies: []
  }
}

/**
 * Comments on a clip, one level of replies deep.
 *
 * Fetched in a single query and threaded in memory rather than with a
 * recursive CTE: depth is capped at one, so the whole thread for a clip is
 * small and a second round trip buys nothing. Replies always read oldest-first
 * regardless of `sort` — a conversation reads top-down.
 */
export default defineEventHandler(async (event): Promise<WatchComment[]> => {
  const parsed = paramsSchema.safeParse({ slug: getRouterParam(event, 'slug') })
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid watch slug' })
  }
  const query = querySchema.safeParse(getQuery(event))
  if (!query.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid sort option' })
  }

  const resolved = await resolveWatchTarget(parsed.data.slug)
  if (!resolved) {
    throw createError({ statusCode: 404, statusMessage: 'That video is not available' })
  }
  // Live sessions have chat, not comments — an empty list is the honest answer
  // for a channel, not a 400 the UI would have to special-case.
  if (resolved.kind !== 'clip') return []

  const rows = await db
    .select()
    .from(comments)
    .where(eq(comments.clipId, resolved.row.id))
    .orderBy(query.data.sort === 'top' ? desc(comments.likes) : desc(comments.createdAt))

  const roots = rows.filter((row) => !row.parentId).map(toComment)
  const byId = new Map(roots.map((comment) => [comment.id, comment]))

  for (const row of [...rows].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())) {
    if (!row.parentId) continue
    byId.get(row.parentId)?.replies.push(toComment(row))
  }

  return roots
})
