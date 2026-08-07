import type { ChatMessage } from '#shared/types/watch'

/** Keeps memory bounded on a long-running stream; older lines scroll out anyway. */
export const CHAT_BUFFER_LIMIT = 200

/**
 * Merge a polled batch into the messages already on screen.
 *
 * Deduped by id and re-sorted by timestamp because the two sources can overlap:
 * an optimistic local message and the same message coming back from the server
 * on the next poll are one line, not two. Keeping only the newest
 * `CHAT_BUFFER_LIMIT` bounds a stream that's been live for hours.
 */
export function mergeChatMessages(
  current: ChatMessage[],
  incoming: ChatMessage[]
): ChatMessage[] {
  if (!incoming.length) return current

  const byId = new Map(current.map((message) => [message.id, message]))
  for (const message of incoming) byId.set(message.id, message)

  return [...byId.values()]
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    .slice(-CHAT_BUFFER_LIMIT)
}
