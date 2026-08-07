import { pgEnum, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core'
import { user } from './auth'

export const reactionTargetEnum = pgEnum('reaction_target', ['clip', 'live'])
export const reactionValueEnum = pgEnum('reaction_value', ['like', 'dislike'])

/**
 * One like-or-dislike per user per target. The unique constraint is what makes
 * the toggle endpoint safe: switching like → dislike is an upsert, not a
 * read-then-write race that could leave a user with two rows.
 *
 * `targetId` is a plain text id (a `clips.id` or a `live_streams.id`) rather
 * than two nullable FKs — `targetKind` says which table it points at. Trade-off
 * recorded in ADR-014: no referential integrity, in exchange for one table
 * instead of two near-identical ones.
 */
export const reactions = pgTable(
  'reactions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    targetId: text('target_id').notNull(),
    targetKind: reactionTargetEnum('target_kind').notNull(),
    value: reactionValueEnum('value').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow()
  },
  (table) => [unique('reactions_user_target_unique').on(table.userId, table.targetId)]
)
