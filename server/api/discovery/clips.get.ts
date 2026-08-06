import { desc } from 'drizzle-orm'
import { db } from '../../db/client'
import { clips } from '../../db/schema'
import { formatAge, formatCount, formatDuration } from '../../utils/format'
import type { Clip } from '#shared/types/discovery'

export default defineEventHandler(async () => {
  const rows = await db.select().from(clips).orderBy(desc(clips.createdAt))

  const toClip = (row: (typeof rows)[number]): Clip => ({
    id: row.id,
    title: row.title,
    creator: row.creator,
    category: row.category,
    age: row.featured ? 'Now' : formatAge(row.createdAt),
    views: `${formatCount(row.views)} ${row.featured ? 'watching' : 'views'}`,
    duration: formatDuration(row.durationSeconds),
    image: row.thumbnailUrl,
    videoUrl: row.videoUrl
  })

  const featuredRow = rows.find((row) => row.featured) ?? rows[0]
  if (!featuredRow) {
    throw createError({ statusCode: 404, statusMessage: 'No clips available' })
  }

  return {
    featured: toClip(featuredRow),
    clips: rows.filter((row) => row.id !== featuredRow.id).map(toClip)
  }
})
