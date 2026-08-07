import { z } from 'zod'
import { listChannels } from '../utils/channels'
import { searchVideos } from '../utils/search'
import { getSessionUser } from '../utils/session'
import type { SearchResults } from '#shared/types/search'

const querySchema = z.object({
  q: z.string().trim().min(1).max(100),
  limit: z.coerce.number().int().min(1).max(40).default(20)
})

/** Channel hits are the smaller bucket — a few exact-ish names, not a directory page. */
const CHANNEL_LIMIT = 6

/**
 * One query, two buckets: videos (VODs + live) and channels. Both halves run in
 * the database with their own `limit`, so this stays one round trip's worth of
 * work no matter how large the catalogue gets.
 */
export default defineEventHandler(async (event): Promise<SearchResults> => {
  const parsed = querySchema.safeParse(getQuery(event))
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Enter something to search for' })
  }

  const { q, limit } = parsed.data
  const user = await getSessionUser(event)

  const [videos, channels] = await Promise.all([
    searchVideos(q, limit),
    listChannels({ search: q, limit: CHANNEL_LIMIT, userId: user?.id ?? null })
  ])

  return { query: q, videos, channels }
})
