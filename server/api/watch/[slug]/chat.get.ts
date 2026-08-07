import { and, asc, eq, gt } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../../db/client'
import { chatMessages } from '../../../db/schema'
import { resolveWatchTarget } from '../../../utils/watch'
import type { ChatMessage } from '#shared/types/watch'

const paramsSchema = z.object({ slug: z.string().min(1).max(200) })
const querySchema = z.object({ since: z.iso.datetime().optional() })
const WINDOW = 100

/**
 * Chat backlog for a live session, oldest first.
 *
 * `?since=<iso>` returns only newer messages so a poll costs one small query
 * instead of re-sending the whole window; the client merges by id. Without it,
 * the most recent `WINDOW` messages come back for the initial paint.
 */
export default defineEventHandler(async (event): Promise<ChatMessage[]> => {
  const parsed = paramsSchema.safeParse({ slug: getRouterParam(event, 'slug') })
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid watch slug' })
  }
  const query = querySchema.safeParse(getQuery(event))
  if (!query.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid `since` timestamp' })
  }

  const resolved = await resolveWatchTarget(parsed.data.slug)
  if (!resolved) {
    throw createError({ statusCode: 404, statusMessage: 'That video is not available' })
  }
  // A clip has no chat. Empty list, not an error — the UI simply doesn't
  // render the panel for VODs.
  if (resolved.kind !== 'live') return []

  const since = query.data.since ? new Date(query.data.since) : null
  const rows = await db
    .select()
    .from(chatMessages)
    .where(
      since
        ? and(eq(chatMessages.streamId, resolved.row.id), gt(chatMessages.createdAt, since))
        : eq(chatMessages.streamId, resolved.row.id)
    )
    .orderBy(asc(chatMessages.createdAt))
    .limit(WINDOW)

  return rows.map((row) => ({
    id: row.id,
    authorName: row.authorName,
    body: row.body,
    createdAt: row.createdAt.toISOString()
  }))
})
