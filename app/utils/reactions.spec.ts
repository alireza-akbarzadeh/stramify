import { describe, expect, it } from 'vitest'
import type { ReactionSummary } from '#shared/types/watch'
import { applyReaction } from './reactions'

const summary = (over: Partial<ReactionSummary> = {}): ReactionSummary => ({
  likes: 10,
  dislikes: 2,
  mine: null,
  ...over
})

describe('applyReaction', () => {
  it('adds a like when nothing was picked', () => {
    expect(applyReaction(summary(), 'like')).toEqual({ likes: 11, dislikes: 2, mine: 'like' })
  })

  it('clears the like when the same button is pressed again', () => {
    expect(applyReaction(summary({ mine: 'like' }), 'like')).toEqual({
      likes: 9,
      dislikes: 2,
      mine: null
    })
  })

  it('moves the count across when switching like to dislike', () => {
    expect(applyReaction(summary({ mine: 'like' }), 'dislike')).toEqual({
      likes: 9,
      dislikes: 3,
      mine: 'dislike'
    })
  })

  it('moves the count across when switching dislike to like', () => {
    expect(applyReaction(summary({ mine: 'dislike' }), 'like')).toEqual({
      likes: 11,
      dislikes: 1,
      mine: 'like'
    })
  })

  it('does not mutate the summary it was given', () => {
    const original = summary({ mine: 'like' })
    applyReaction(original, 'dislike')
    expect(original).toEqual({ likes: 10, dislikes: 2, mine: 'like' })
  })
})
