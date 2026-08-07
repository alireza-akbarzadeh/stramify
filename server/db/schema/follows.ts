import { index, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core'
import { user } from './auth'

/**
 * Who follows which channel.
 *
 * `channel` is a text handle, not a foreign key, because there is no
 * `channels` table yet — `clips.creator` and `live_streams.streamer_name` are
 * the only channel identity in the schema today, and both are free text. The
 * known cost: renaming a channel orphans its followers. Accepted for now and
 * recorded in ADR-014; a future `channels` table turns this column into an FK
 * in one migration.
 */
export const follows = pgTable(
  'follows',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    channel: text('channel').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow()
  },
  (table) => [
    unique('follows_user_channel_unique').on(table.userId, table.channel),
    // Follower counts read by channel, so this carries the `/watch` header.
    index('follows_channel_idx').on(table.channel)
  ]
)
