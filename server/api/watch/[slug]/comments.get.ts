import { z } from 'zod'
import { resolveWatchTarget } from '../../../utils/watch'
import { readClipComments } from '../../../utils/comments'
import { getSessionUser } from '../../../utils/session'
import type { WatchComment } from '#shared/types/watch'

const paramsSchema = z.object({ slug: z.string().min(1).max(200) })
const querySchema = z.object({ sort: z.enum(['new', 'top']).default('top') })

/**
 * Comments on a clip, one level of replies deep.
 *
 * Readable signed out — the session is optional and only decides whether
 * `likedByMe` / `isMine` can be true, never whether the list is returned.
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

  const user = await getSessionUser(event)
  return readClipComments(resolved.row.id, query.data.sort, user?.id ?? null)
})
