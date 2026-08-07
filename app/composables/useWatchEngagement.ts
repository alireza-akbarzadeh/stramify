import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import type { ReactionSummary, ReactionValue } from '#shared/types/watch'
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

// `useChannelFollow` used to live here. It moved to `useChannel.ts` when the
// channel page and the channel directory started sharing the same follow
// state — one mutation now patches every cached shape of a channel.
