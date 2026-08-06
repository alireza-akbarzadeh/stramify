import { desc } from 'drizzle-orm'
import { db } from '../../db/client'
import { liveStreams } from '../../db/schema'
import { toLiveSignal } from '../../utils/discovery'
import type { LiveSignal } from '#shared/types/discovery'

/** Everyone live right now, busiest channel first. */
export default defineEventHandler(async (): Promise<LiveSignal[]> => {
  const rows = await db.select().from(liveStreams).orderBy(desc(liveStreams.viewerCount))
  return rows.map(toLiveSignal)
})
