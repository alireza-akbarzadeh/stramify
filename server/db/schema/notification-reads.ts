import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from './auth'

/**
 * Where each user's notification bell was last cleared.
 *
 * There is no `notifications` table: every notification is derived at read
 * time from the rows that caused it — a followed channel going live, or
 * publishing a clip (see `server/utils/notifications.ts`). Storing one cursor
 * per user instead of one row per user-per-event means nothing has to be
 * fanned out on write, and nothing can drift out of sync with the content it
 * describes. Everything newer than `readAt` is unread.
 */
export const notificationReads = pgTable('notification_reads', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  readAt: timestamp('read_at').notNull().defaultNow()
})
