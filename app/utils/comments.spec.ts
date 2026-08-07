import { describe, expect, it } from 'vitest'
import type { WatchComment } from '#shared/types/watch'
import {
  applyCommentLike,
  countComments,
  insertComment,
  mapComment,
  removeComment
} from './comments'

const comment = (id: string, over: Partial<WatchComment> = {}): WatchComment => ({
  id,
  authorName: 'viewer',
  authorImage: null,
  body: 'body',
  likes: 10,
  likedByMe: false,
  isMine: false,
  age: '1h ago',
  replies: [],
  ...over
})

/** A root with one reply, the shape every thread operation has to handle. */
const thread = (): WatchComment[] => [
  comment('root-1', { replies: [comment('reply-1')] }),
  comment('root-2')
]

describe('countComments', () => {
  it('counts replies toward the total', () => {
    expect(countComments(thread())).toBe(3)
  })

  it('is zero for an empty thread', () => {
    expect(countComments([])).toBe(0)
  })
})

describe('mapComment', () => {
  it('transforms a root comment', () => {
    const next = mapComment(thread(), 'root-2', (c) => ({ ...c, body: 'edited' }))
    expect(next[1]?.body).toBe('edited')
  })

  it('transforms a nested reply', () => {
    const next = mapComment(thread(), 'reply-1', (c) => ({ ...c, body: 'edited' }))
    expect(next[0]?.replies[0]?.body).toBe('edited')
  })

  it('leaves the thread alone when the id is absent', () => {
    const original = thread()
    expect(mapComment(original, 'nope', (c) => ({ ...c, body: 'x' }))).toEqual(original)
  })

  it('does not mutate the thread it was given', () => {
    const original = thread()
    mapComment(original, 'reply-1', (c) => ({ ...c, body: 'edited' }))
    expect(original[0]?.replies[0]?.body).toBe('body')
  })
})

describe('removeComment', () => {
  it('drops a root and its replies with it', () => {
    const next = removeComment(thread(), 'root-1')
    expect(next.map((c) => c.id)).toEqual(['root-2'])
  })

  it('drops a reply without touching its parent', () => {
    const next = removeComment(thread(), 'reply-1')
    expect(next[0]?.id).toBe('root-1')
    expect(next[0]?.replies).toEqual([])
  })

  it('does not mutate the thread it was given', () => {
    const original = thread()
    removeComment(original, 'reply-1')
    expect(original[0]?.replies).toHaveLength(1)
  })
})

describe('insertComment', () => {
  it('puts a new root first so the author sees it immediately', () => {
    const next = insertComment(thread(), comment('new'), null)
    expect(next.map((c) => c.id)).toEqual(['new', 'root-1', 'root-2'])
  })

  it('appends a reply last, matching the oldest-first order the API returns', () => {
    const next = insertComment(thread(), comment('new'), 'root-1')
    expect(next[0]?.replies.map((c) => c.id)).toEqual(['reply-1', 'new'])
  })

  it('does not mutate the thread it was given', () => {
    const original = thread()
    insertComment(original, comment('new'), 'root-1')
    expect(original[0]?.replies).toHaveLength(1)
  })
})

describe('applyCommentLike', () => {
  it('adds a like when the viewer has not liked it', () => {
    expect(applyCommentLike(comment('a'))).toMatchObject({ likes: 11, likedByMe: true })
  })

  it('removes the like when pressed again', () => {
    expect(applyCommentLike(comment('a', { likedByMe: true }))).toMatchObject({
      likes: 9,
      likedByMe: false
    })
  })

  it('does not mutate the comment it was given', () => {
    const original = comment('a')
    applyCommentLike(original)
    expect(original).toMatchObject({ likes: 10, likedByMe: false })
  })
})
