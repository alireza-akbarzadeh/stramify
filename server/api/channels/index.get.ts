import { z } from 'zod'
import { listChannels } from '../../utils/channels'
import { getSessionUser } from '../../utils/session'
import { CLIP_CATEGORIES } from '#shared/utils/category'
import type { ChannelListItem } from '#shared/types/channel'

const querySchema = z.object({
  sort: z.enum(['top', 'followers', 'views', 'live', 'new']).default('top'),
  q: z.string().trim().max(100).optional(),
  category: z.enum(CLIP_CATEGORIES).optional(),
  limit: z.coerce.number().int().min(1).max(60).default(60)
})

/**
 * The channel directory. Ranking happens in the database (see
 * `server/utils/channels.ts`) so `limit` is a real limit, not a slice of an
 * already-fetched list.
 */
export default defineEventHandler(async (event): Promise<ChannelListItem[]> => {
  const parsed = querySchema.safeParse(getQuery(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid channel query' })
  }

  const user = await getSessionUser(event)
  const { sort, q, category, limit } = parsed.data
  return listChannels({ sort, search: q || undefined, category, limit, userId: user?.id ?? null })
})
