import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

/**
 * Channel identity — the things a channel page shows that no aggregate can
 * derive: display name, banner, avatar, tagline, bio, verification.
 *
 * Everything countable is deliberately *not* here. Followers, total views,
 * clip count and "live right now" are computed at query time from `follows`,
 * `clips` and `live_streams` (see `server/utils/channels.ts`), so there is no
 * counter to drift out of sync with the rows it summarises.
 *
 * `handle` is the primary key and is stored lowercase — it's the canonical
 * identity and the URL segment (`/channel/canvas_queen`). `clips.creator`,
 * `live_streams.streamer_name` and `follows.channel` still hold free-text
 * handles in their original casing and join against this table on
 * `lower(...)`, exactly as they already did against each other (ADR-014).
 * Turning those columns into real foreign keys is a later migration; this
 * table is additive and a channel with content but no row here still renders
 * from its derived stats alone.
 */
export const channels = pgTable('channels', {
  handle: text('handle').primaryKey(),
  displayName: text('display_name').notNull(),
  /** One line under the name on the channel page. */
  tagline: text('tagline'),
  /** Long-form About copy. Nullable — a new channel hasn't written one yet. */
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  bannerUrl: text('banner_url'),
  websiteUrl: text('website_url'),
  location: text('location'),
  verified: boolean('verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow()
})
