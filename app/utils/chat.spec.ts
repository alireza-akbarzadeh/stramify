import { describe, expect, it } from 'vitest'
import type { ChatMessage } from '#shared/types/watch'
import { CHAT_BUFFER_LIMIT, mergeChatMessages } from './chat'

const message = (id: string, secondsAgo: number, body = id): ChatMessage => ({
  id,
  authorName: 'tester',
  body,
  createdAt: new Date(Date.now() - secondsAgo * 1000).toISOString()
})

describe('mergeChatMessages', () => {
  it('appends new messages in timestamp order', () => {
    const current = [message('a', 30), message('b', 20)]
    const merged = mergeChatMessages(current, [message('c', 10)])
    expect(merged.map((m) => m.id)).toEqual(['a', 'b', 'c'])
  })

  it('sorts a batch that arrives out of order', () => {
    const merged = mergeChatMessages([], [message('late', 5), message('early', 50)])
    expect(merged.map((m) => m.id)).toEqual(['early', 'late'])
  })

  it('dedupes by id so an optimistic message is not doubled by the next poll', () => {
    const optimistic = message('sent-1', 2, 'hello')
    const fromServer = { ...optimistic, body: 'hello' }
    const merged = mergeChatMessages([message('a', 30), optimistic], [fromServer])
    expect(merged).toHaveLength(2)
    expect(merged.at(-1)).toEqual(fromServer)
  })

  it('returns the current list untouched when the poll is empty', () => {
    const current = [message('a', 10)]
    expect(mergeChatMessages(current, [])).toBe(current)
  })

  it('keeps only the newest messages once past the buffer limit', () => {
    const many = Array.from({ length: CHAT_BUFFER_LIMIT + 25 }, (_, index) =>
      message(`m-${index}`, CHAT_BUFFER_LIMIT + 25 - index)
    )
    const merged = mergeChatMessages([], many)
    expect(merged).toHaveLength(CHAT_BUFFER_LIMIT)
    expect(merged.at(-1)?.id).toBe(`m-${CHAT_BUFFER_LIMIT + 24}`)
    expect(merged[0]?.id).toBe('m-25')
  })
})
