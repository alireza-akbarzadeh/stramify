import { z } from 'zod'
import { getSessionUser } from '../../../utils/session'
import { readChannelProfile } from '../../../utils/channels'
import type { ChannelProfile } from '#shared/types/channel'

const paramsSchema = z.object({ name: z.string().min(1).max(100) })

/**
 * Everything `/channel/[handle]` renders above its tabs. Readable signed out —
 * `isFollowing` is just false then. 404 for a handle nothing is published
 * under, which the page renders as a real "no such channel" state.
 */
export default defineEventHandler(async (event): Promise<ChannelProfile> => {
  const parsed = paramsSchema.safeParse({ name: getRouterParam(event, 'name') })
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid channel name' })
  }

  const user = await getSessionUser(event)
  const profile = await readChannelProfile(parsed.data.name, user?.id ?? null)
  if (!profile) {
    throw createError({ statusCode: 404, statusMessage: 'That channel does not exist' })
  }

  return profile
})
