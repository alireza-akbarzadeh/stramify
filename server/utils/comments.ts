import { and, count, eq, inArray } from 'drizzle-orm'
import { db } from '../db/client'
import { commentLikes, comments } from '../db/schema'
import { formatAge } from './format'
import type { CommentSort, WatchComment } from '#shared/types/watch'

type CommentRow = typeof comments.$inferSelect

/** Per-comment like state, resolved once for a whole thread. */
export interface LikeState {
  counts: Map<string, number>
  mine: Set<string>
}

/** Like state for a comment that provably has none yet — a fresh insert. */
export const noLikes = (): LikeState => ({ counts: new Map(), mine: new Set() })

/**
 * Real like rows for a set of comments, plus which of them the caller owns.
 *
 * Counted with a group-by rather than by fetching the rows: a popular comment
 * can have thousands of likes and we only ever render the number. The caller's
 * own likes are a second, always-small query — skipped entirely when signed out.
 */
async function readLikeState(commentIds: string[], userId: string | null): Promise<LikeState> {
  if (!commentIds.length) return { counts: new Map(), mine: new Set() }

  const totals = await db
    .select({ commentId: commentLikes.commentId, total: count() })
    .from(commentLikes)
    .where(inArray(commentLikes.commentId, commentIds))
    .groupBy(commentLikes.commentId)

  const mine = userId
    ? await db
        .select({ commentId: commentLikes.commentId })
        .from(commentLikes)
        .where(
          and(eq(commentLikes.userId, userId), inArray(commentLikes.commentId, commentIds))
        )
    : []

  return {
    counts: new Map(totals.map((row) => [row.commentId, row.total])),
    mine: new Set(mine.map((row) => row.commentId))
  }
}

/**
 * Row → wire shape. `likes` is the seeded baseline plus real like rows, so
 * seeded social proof survives and app-written comments start at zero.
 */
export function toComment(row: CommentRow, likes: LikeState, userId: string | null): WatchComment {
  return {
    id: row.id,
    authorName: row.authorName,
    authorImage: row.authorImage,
    body: row.body,
    likes: row.likes + (likes.counts.get(row.id) ?? 0),
    likedByMe: likes.mine.has(row.id),
    isMine: !!userId && row.userId === userId,
    age: formatAge(row.createdAt),
    replies: []
  }
}

/** Newest-first, or most-liked-first with newest breaking ties. */
function sortRoots(roots: WatchComment[], rows: Map<string, CommentRow>, sort: CommentSort) {
  const at = (comment: WatchComment) => rows.get(comment.id)?.createdAt.getTime() ?? 0
  roots.sort((a, b) =>
    sort === 'top' ? b.likes - a.likes || at(b) - at(a) : at(b) - at(a)
  )
}

/**
 * The whole comment thread for a clip, one level of replies deep.
 *
 * Threaded in memory rather than with a recursive CTE: depth is capped at one,
 * so a clip's thread is small and a second round trip buys nothing. Sorting
 * happens here too — `top` ranks on the *combined* like total, which only
 * exists once baseline and real likes are added together. Replies always read
 * oldest-first regardless of `sort`; a conversation reads top-down.
 */
export async function readClipComments(
  clipId: string,
  sort: CommentSort,
  userId: string | null
): Promise<WatchComment[]> {
  const rows = await db.select().from(comments).where(eq(comments.clipId, clipId))
  const likes = await readLikeState(
    rows.map((row) => row.id),
    userId
  )

  const roots: WatchComment[] = rows
    .filter((row) => !row.parentId)
    .map((row) => toComment(row, likes, userId))
  const byId = new Map(roots.map((comment) => [comment.id, comment]))

  for (const row of [...rows].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())) {
    if (!row.parentId) continue
    byId.get(row.parentId)?.replies.push(toComment(row, likes, userId))
  }

  sortRoots(roots, new Map(rows.map((row) => [row.id, row])), sort)
  return roots
}

/**
 * One comment by id, scoped to a clip so a caller can't touch a comment on
 * another video by guessing ids. Returns `null` when it doesn't exist there.
 */
export async function findClipComment(clipId: string, id: string): Promise<CommentRow | null> {
  const [row] = await db
    .select()
    .from(comments)
    .where(and(eq(comments.id, id), eq(comments.clipId, clipId)))
    .limit(1)
  return row ?? null
}
