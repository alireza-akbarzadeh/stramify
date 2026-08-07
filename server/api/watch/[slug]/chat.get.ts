import { and, asc, eq, gt } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../../db/client'
import { chatMessages } from '../../../db/schema'
import { resolveLiveStream } from '../../../utils/watch'
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

  // A slug that isn't a live channel simply has no chat. Empty list rather
  // than a 404: a clip slug is a legitimate request here, the UI just never
  // renders the panel for VODs.
  const stream = await resolveLiveStream(parsed.data.slug)
  if (!stream) return []

  const since = query.data.since ? new Date(query.data.since) : null
  const rows = await db
    .select()
    .from(chatMessages)
    .where(
      since
        ? and(eq(chatMessages.streamId, stream.id), gt(chatMessages.createdAt, since))
        : eq(chatMessages.streamId, stream.id)
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
