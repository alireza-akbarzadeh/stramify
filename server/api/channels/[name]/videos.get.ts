import { z } from 'zod'
import { readChannelVideos } from '../../../utils/channels'
import type { Clip } from '#shared/types/discovery'

const paramsSchema = z.object({ name: z.string().min(1).max(100) })
const querySchema = z.object({ sort: z.enum(['latest', 'popular', 'oldest']).default('latest') })

/**
 * A channel's published clips. Returns the same `Clip` shape the discovery feed
 * uses, so the channel page renders them with the existing `ClipCard`.
 *
 * An empty array is a valid answer (a channel that only goes live has no
 * clips) — the 404 for an unknown handle belongs to `profile.get.ts`, which the
 * page loads first.
 */
export default defineEventHandler(async (event): Promise<Clip[]> => {
  const params = paramsSchema.safeParse({ name: getRouterParam(event, 'name') })
  const query = querySchema.safeParse(getQuery(event))
  if (!params.success || !query.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid channel video query' })
  }

  return readChannelVideos(params.data.name, query.data.sort)
})
