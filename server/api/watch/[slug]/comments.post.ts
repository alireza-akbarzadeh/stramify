import { z } from 'zod'
import { db } from '../../../db/client'
import { comments } from '../../../db/schema'
import { resolveWatchTarget } from '../../../utils/watch'
import { findClipComment, noLikes, toComment } from '../../../utils/comments'
import { requireUser } from '../../../utils/session'
import type { WatchComment } from '#shared/types/watch'

const paramsSchema = z.object({ slug: z.string().min(1).max(200) })
const bodySchema = z.object({
  body: z.string().trim().min(1).max(1000),
  parentId: z.string().min(1).max(200).nullish()
})

/**
 * Post a comment, or a reply when `parentId` is set.
 *
 * Auth is enforced here, not by whether the client rendered a composer
 * (CLAUDE.md §5). Replies are capped at one level to match what the reader
 * threads and what the UI renders: replying to a reply attaches to that
 * reply's parent rather than 400-ing, which is what the viewer means anyway.
 */
export default defineEventHandler(async (event): Promise<WatchComment> => {
  const parsed = paramsSchema.safeParse({ slug: getRouterParam(event, 'slug') })
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid watch slug' })
  }

  const user = await requireUser(event)
  const body = bodySchema.safeParse(await readBody(event))
  if (!body.success) {
    throw createError({ statusCode: 400, statusMessage: 'Comment must be 1–1000 characters' })
  }

  const resolved = await resolveWatchTarget(parsed.data.slug)
  if (!resolved) {
    throw createError({ statusCode: 404, statusMessage: 'That video is not available' })
  }
  if (resolved.kind !== 'clip') {
    throw createError({ statusCode: 400, statusMessage: 'Live channels use chat, not comments' })
  }

  let parentId: string | null = null
  if (body.data.parentId) {
    const parent = await findClipComment(resolved.row.id, body.data.parentId)
    if (!parent) {
      throw createError({ statusCode: 404, statusMessage: 'That comment no longer exists' })
    }
    parentId = parent.parentId ?? parent.id
  }

  const [row] = await db
    .insert(comments)
    .values({
      id: `comment-${crypto.randomUUID()}`,
      clipId: resolved.row.id,
      parentId,
      userId: user.id,
      authorName: user.name,
      authorImage: user.image ?? null,
      body: body.data.body
    })
    .returning()

  if (!row) {
    throw createError({ statusCode: 500, statusMessage: 'Could not post that comment' })
  }

  // Brand new, so it has no likes yet — an empty like state is accurate and
  // saves a round trip that could only ever return zero.
  return toComment(row, noLikes(), user.id)
})
