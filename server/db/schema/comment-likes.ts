import { pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core'
import { comments } from './comments'
import { user } from './auth'

/**
 * One like per user per comment. The unique constraint is what makes the
 * toggle endpoint safe under a double-click: the insert is an upsert, so two
 * fast clicks can't leave a user holding two like rows for one comment.
 *
 * These rows count *on top of* `comments.likes`, which stays as the seeded
 * baseline — see `server/utils/comments.ts`. A comment written in the app
 * starts at a baseline of 0, so its displayed total is purely real likes.
 */
export const commentLikes = pgTable(
  'comment_likes',
  {
    id: text('id').primaryKey(),
    commentId: text('comment_id')
      .notNull()
      .references(() => comments.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').notNull().defaultNow()
  },
  (table) => [unique('comment_likes_user_comment_unique').on(table.userId, table.commentId)]
)
