import type { WatchComment } from '#shared/types/watch'

/**
 * Pure operations on a comment thread, kept out of the composable so the
 * optimistic updates in `useWatchCommentMutations` can be tested without
 * pulling in vue-query — the same split `applyReaction` uses.
 *
 * Every function returns a new tree rather than mutating: vue-query hands out
 * the cached array by reference, and editing it in place would change what's
 * on screen before the rollback snapshot was taken.
 */

/** Replies count toward the total the way viewers read it — "42 comments". */
export function countComments(list: WatchComment[]): number {
  return list.reduce((sum, comment) => sum + 1 + comment.replies.length, 0)
}

/** Apply `fn` to the comment with `id`, at either level. */
export function mapComment(
  list: WatchComment[],
  id: string,
  fn: (comment: WatchComment) => WatchComment
): WatchComment[] {
  return list.map((comment) => {
    if (comment.id === id) return fn(comment)
    if (!comment.replies.some((reply) => reply.id === id)) return comment
    return {
      ...comment,
      replies: comment.replies.map((reply) => (reply.id === id ? fn(reply) : reply))
    }
  })
}

/** Drop the comment with `id`. Removing a root takes its replies with it. */
export function removeComment(list: WatchComment[], id: string): WatchComment[] {
  return list
    .filter((comment) => comment.id !== id)
    .map((comment) =>
      comment.replies.some((reply) => reply.id === id)
        ? { ...comment, replies: comment.replies.filter((reply) => reply.id !== id) }
        : comment
    )
}

/**
 * Insert a new comment: replies go last on their parent (oldest-first, the
 * order the API returns), roots go first so you see what you just wrote
 * without hunting for it — even under "Top", where it hasn't earned a rank yet.
 */
export function insertComment(
  list: WatchComment[],
  comment: WatchComment,
  parentId: string | null
): WatchComment[] {
  if (!parentId) return [comment, ...list]
  return list.map((root) =>
    root.id === parentId ? { ...root, replies: [...root.replies, comment] } : root
  )
}

/** Local prediction of the server's like toggle — press again to undo. */
export function applyCommentLike(comment: WatchComment): WatchComment {
  return {
    ...comment,
    likedByMe: !comment.likedByMe,
    likes: comment.likes + (comment.likedByMe ? -1 : 1)
  }
}
