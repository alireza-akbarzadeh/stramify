import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { ChannelSummary, ReactionSummary, ReactionValue } from '#shared/types/watch'
import { applyReaction } from '@/utils/reactions'

const EMPTY_REACTIONS: ReactionSummary = { likes: 0, dislikes: 0, mine: null }

/**
 * Like/dislike for one watch target. The mutation applies the toggle locally
 * before the request resolves so the button responds instantly, then takes the
 * server's authoritative totals from the response. On failure the cache is
 * invalidated, which snaps the count back to the truth rather than leaving a
 * like that never happened on screen.
 */
export function useWatchReaction(slug: MaybeRefOrGetter<string>) {
  const key = computed(() => toValue(slug))
  const client = useQueryClient()
  const queryKey = computed(() => ['watch', 'reaction', key.value])

  const query = useQuery({
    queryKey: ['watch', 'reaction', key],
    queryFn: () => $fetch<ReactionSummary>(`/api/watch/${encodeURIComponent(key.value)}/reaction`),
    enabled: computed(() => !!key.value)
  })

  const toggle = useMutation({
    mutationFn: (value: ReactionValue) =>
      $fetch<ReactionSummary>(`/api/watch/${encodeURIComponent(key.value)}/reaction`, {
        method: 'POST',
        body: { value }
      }),
    onMutate: (value) => {
      const previous = client.getQueryData<ReactionSummary>(queryKey.value)
      if (previous) client.setQueryData(queryKey.value, applyReaction(previous, value))
      return { previous }
    },
    onSuccess: (summary) => client.setQueryData(queryKey.value, summary),
    onError: (_error, _value, context) => {
      if (context?.previous) client.setQueryData(queryKey.value, context.previous)
    }
  })

  return { reactions: computed(() => query.data.value ?? EMPTY_REACTIONS), toggle }
}

/**
 * Follow state for a channel. The server returns the fresh summary from the
 * toggle, so the follower count and the button update from one round trip.
 */
export function useChannelFollow(name: MaybeRefOrGetter<string>) {
  const key = computed(() => toValue(name))
  const client = useQueryClient()
  const queryKey = computed(() => ['channel', key.value])

  const query = useQuery({
    queryKey: ['channel', key],
    queryFn: () => $fetch<ChannelSummary>(`/api/channels/${encodeURIComponent(key.value)}`),
    enabled: computed(() => !!key.value)
  })

  const toggle = useMutation({
    mutationFn: () =>
      $fetch<ChannelSummary>(`/api/channels/${encodeURIComponent(key.value)}/follow`, {
        method: 'POST'
      }),
    onSuccess: (summary) => client.setQueryData(queryKey.value, summary)
  })

  return { channel: computed(() => query.data.value ?? null), toggle }
}
