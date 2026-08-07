import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { liveStreams } from './live-streams'
import { user } from './auth'

/**
 * Live-chat lines for a stream. Real, persisted messages served over REST and
 * refetched on an interval (ADR-015) — deliberately *not* faked realtime. The
 * crossws + Redis fan-out in Phase 8 broadcasts inserts into this same table,
 * so the swap is a transport change with no schema or UI rewrite.
 *
 * `authorName` is denormalized from `user.name` so rendering a message never
 * needs a join, and a deleted account doesn't blank out chat history.
 */
export const chatMessages = pgTable(
  'chat_messages',
  {
    id: text('id').primaryKey(),
    streamId: text('stream_id')
      .notNull()
      .references(() => liveStreams.id, { onDelete: 'cascade' }),
    userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
    authorName: text('author_name').notNull(),
    body: text('body').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow()
  },
  // The only read pattern: newest N for one stream, plus `?since=` polls.
  (table) => [index('chat_messages_stream_created_idx').on(table.streamId, table.createdAt)]
)
