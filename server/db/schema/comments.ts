import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { clips } from './clips'
import { user } from './auth'

/**
 * Comments on a clip, backing the read-only comment section on `/watch/[slug]`
 * (ADR-014). Live sessions get chat instead — see `chat-messages.ts`.
 *
 * `userId` is nullable and `authorName` is always set: seeded rows have no
 * account behind them, and the list renders identically either way. When
 * posting is enabled, a real comment fills both columns — no migration.
 * `parentId` gives exactly one level of replies; the API doesn't nest deeper.
 */
export const comments = pgTable(
  'comments',
  {
    id: text('id').primaryKey(),
    clipId: text('clip_id')
      .notNull()
      .references(() => clips.id, { onDelete: 'cascade' }),
    // Self-reference is typed explicitly — Drizzle can't infer a table that
    // isn't finished being defined yet.
    parentId: text('parent_id'),
    userId: text('user_id').references(() => user.id, { onDelete: 'set null' }),
    authorName: text('author_name').notNull(),
    authorImage: text('author_image'),
    body: text('body').notNull(),
    likes: integer('likes').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow()
  },
  (table) => [index('comments_clip_created_idx').on(table.clipId, table.createdAt)]
)
