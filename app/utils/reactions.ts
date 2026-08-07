import type { ReactionSummary, ReactionValue } from '#shared/types/watch'

/**
 * Local prediction of the server's toggle rule, used for the optimistic
 * update in `useWatchReaction`: pressing the button you already have clears
 * it, pressing the other one moves the count across.
 *
 * Pure and separate from the composable so it can be tested without pulling
 * in vue-query — and so the client's prediction and the server's behaviour
 * are one readable rule each, easy to compare when they disagree.
 */
export function applyReaction(summary: ReactionSummary, value: ReactionValue): ReactionSummary {
  const next = { ...summary }
  if (next.mine === 'like') next.likes -= 1
  if (next.mine === 'dislike') next.dislikes -= 1

  if (next.mine === value) {
    next.mine = null
    return next
  }

  next.mine = value
  if (value === 'like') next.likes += 1
  else next.dislikes += 1
  return next
}
