import { boolean, integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const clipCategoryEnum = pgEnum('clip_category', ['Music', 'Gaming', 'Creative'])

/**
 * Real clips backing the discovery feed. `videoUrl` points at a directly
 * playable source (mp4/HLS) — Cloudflare Stream playback URLs will land
 * here once creator uploads exist (Phase 6/7); the column shape doesn't
 * need to change when that happens.
 */
export const clips = pgTable('clips', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  creator: text('creator').notNull(),
  category: clipCategoryEnum('category').notNull(),
  // Nullable: added for the watch page (ADR-014) after rows already existed,
  // and creator uploads won't always carry one. The UI renders an explicit
  // "No description provided" rather than a blank block.
  description: text('description'),
  videoUrl: text('video_url').notNull(),
  thumbnailUrl: text('thumbnail_url').notNull(),
  durationSeconds: integer('duration_seconds').notNull(),
  views: integer('views').notNull().default(0),
  featured: boolean('featured').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow()
})
