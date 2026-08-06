import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { clipCategoryEnum } from './clips'

/**
 * Channels that are live right now, backing the `/live` directory and the
 * "Live Signals" rail. Same shape the real ingest pipeline will write to:
 * `videoUrl` is a directly playable source (mp4/HLS) — Cloudflare Stream
 * live-playback manifests land here once RTMPS ingest exists (Phase 7),
 * without a column change. `startedAt` is when the session went live and
 * drives the uptime display; `createdAt` is row bookkeeping.
 */
export const liveStreams = pgTable('live_streams', {
  id: text('id').primaryKey(),
  streamerName: text('streamer_name').notNull(),
  title: text('title').notNull(),
  category: clipCategoryEnum('category').notNull(),
  videoUrl: text('video_url').notNull(),
  thumbnailUrl: text('thumbnail_url').notNull(),
  viewerCount: integer('viewer_count').notNull().default(0),
  startedAt: timestamp('started_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow()
})
