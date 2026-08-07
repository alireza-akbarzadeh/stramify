import { ilike } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../../../db/client'
import { liveStreams } from '../../../db/schema'
import { toLiveSignal } from '../../../utils/discovery'

const paramsSchema = z.object({ streamer: z.string().min(1) })

/** One live channel by streamer name (case-insensitive). 404 doubles as "not live right now" — there's no separate channels table, so absence from `live_streams` *is* offline. */
export default defineEventHandler(async (event) => {
  const parsed = paramsSchema.safeParse({ streamer: getRouterParam(event, 'streamer') })
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid streamer name' })
  }

  const [row] = await db
    .select()
    .from(liveStreams)
    .where(ilike(liveStreams.streamerName, parsed.data.streamer))
    .limit(1)

  if (!row) {
    throw createError({ statusCode: 404, statusMessage: 'Channel is not live right now' })
  }

  return toLiveSignal(row)
})
