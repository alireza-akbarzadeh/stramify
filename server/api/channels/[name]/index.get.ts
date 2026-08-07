import { z } from 'zod'
import { getSessionUser } from '../../../utils/session'
import { readChannelSummary } from '../../../utils/channels'
import type { ChannelSummary } from '#shared/types/watch'

const paramsSchema = z.object({ name: z.string().min(1).max(100) })

/**
 * Channel header: follower count, clip count, and whether the caller follows.
 * Readable signed out — `isFollowing` is just false then.
 */
export default defineEventHandler(async (event): Promise<ChannelSummary> => {
  const parsed = paramsSchema.safeParse({ name: getRouterParam(event, 'name') })
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid channel name' })
  }

  const user = await getSessionUser(event)
  return readChannelSummary(parsed.data.name, user?.id ?? null)
})
