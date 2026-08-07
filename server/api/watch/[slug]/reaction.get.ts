import { z } from 'zod'
import { resolveWatchTarget } from '../../../utils/watch'
import { getSessionUser } from '../../../utils/session'
import { readReactionSummary } from '../../../utils/reactions'
import type { ReactionSummary } from '#shared/types/watch'

const paramsSchema = z.object({ slug: z.string().min(1).max(200) })

/** Current like/dislike totals. Readable signed out — `mine` is just null then. */
export default defineEventHandler(async (event): Promise<ReactionSummary> => {
  const parsed = paramsSchema.safeParse({ slug: getRouterParam(event, 'slug') })
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid watch slug' })
  }

  const resolved = await resolveWatchTarget(parsed.data.slug)
  if (!resolved) {
    throw createError({ statusCode: 404, statusMessage: 'That video is not available' })
  }

  const user = await getSessionUser(event)
  return readReactionSummary(resolved.row.id, user?.id ?? null)
})
