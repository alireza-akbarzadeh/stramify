import { useMutation, useQuery } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { ChatMessage } from '#shared/types/watch'
import { mergeChatMessages } from '@/utils/chat'

/** How often to poll for new lines while the tab is in front. */
const POLL_MS = 5000

/**
 * Live chat over REST polling (ADR-015). Genuinely persisted messages on a
 * timer — not a fake socket. Each poll asks only for messages newer than the
 * last one held, so a long-running stream stays one small query per tick, and
 * `mergeChatMessages` reconciles the optimistic local copy with the server's.
 *
 * Polling stops when the tab is hidden: nobody is reading a background tab,
 * and an idle stream page shouldn't hammer the database all afternoon.
 *
 * Phase 8 swaps the `refetchInterval` below for a crossws subscription. The
 * returned shape doesn't change, so `WatchChat.vue` is untouched by that.
 */
export function useWatchChat(slug: MaybeRefOrGetter<string>, enabled: MaybeRefOrGetter<boolean>) {
  const key = computed(() => toValue(slug))
  const active = computed(() => !!key.value && toValue(enabled))
  const visibility = useDocumentVisibility()

  const messages = ref<ChatMessage[]>([])
  const endpoint = computed(() => `/api/watch/${encodeURIComponent(key.value)}/chat`)

  const query = useQuery({
    queryKey: ['watch', 'chat', key],
    queryFn: async () => {
      const since = messages.value.at(-1)?.createdAt
      return $fetch<ChatMessage[]>(endpoint.value, { query: since ? { since } : undefined })
    },
    enabled: active,
    refetchInterval: computed(() => (visibility.value === 'visible' ? POLL_MS : false)),
    // A poll returning only new messages must not replace the accumulated
    // buffer — `messages` below is the source of truth for the UI.
    structuralSharing: false
  })

  watch(query.data, (incoming) => {
    if (incoming) messages.value = mergeChatMessages(messages.value, incoming)
  })
  // A different stream is a different conversation — drop the old buffer.
  watch(key, () => {
    messages.value = []
  })

  const send = useMutation({
    mutationFn: (body: string) =>
      $fetch<ChatMessage>(endpoint.value, { method: 'POST', body: { body } }),
    onSuccess: (message) => {
      messages.value = mergeChatMessages(messages.value, [message])
    }
  })

  return { messages, query, send }
}
