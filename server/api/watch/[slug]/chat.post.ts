import { z } from 'zod'
import { db } from '../../../db/client'
import { chatMessages } from '../../../db/schema'
import { resolveLiveStream } from '../../../utils/watch'
import { requireUser } from '../../../utils/session'
import type { ChatMessage } from '#shared/types/watch'

const paramsSchema = z.object({ slug: z.string().min(1).max(200) })
const bodySchema = z.object({ body: z.string().trim().min(1).max(200) })

/**
 * Post one chat message. Auth is enforced here, not by whether the client
 * rendered a composer (CLAUDE.md §5).
 *
 * Phase 8 note: when crossws lands, this handler keeps the insert and gains a
 * Redis publish — subscribers get the same `ChatMessage` shape this returns,
 * so the client swaps `refetchInterval` for a socket and nothing else moves.
 */
export default defineEventHandler(async (event): Promise<ChatMessage> => {
  const parsed = paramsSchema.safeParse({ slug: getRouterParam(event, 'slug') })
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid watch slug' })
  }

  const user = await requireUser(event)
  const body = bodySchema.safeParse(await readBody(event))
  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Message must be 1–200 characters' })
  }

  const stream = await resolveLiveStream(parsed.data.slug)
  if (!stream) {
    throw createError({ statusCode: 404, statusMessage: 'That channel is not live right now' })
  }

  const [row] = await db
    .insert(chatMessages)
    .values({
      id: `chat-${crypto.randomUUID()}`,
      streamId: stream.id,
      userId: user.id,
      authorName: user.name,
      body: body.data.body
    })
    .returning()

  if (!row) {
    throw createError({ statusCode: 500, statusMessage: 'Could not send that message' })
  }

  return {
    id: row.id,
    authorName: row.authorName,
    body: row.body,
    createdAt: row.createdAt.toISOString()
  }
})
