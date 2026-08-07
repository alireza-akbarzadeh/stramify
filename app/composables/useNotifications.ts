import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import type { NotificationFeed } from '#shared/types/notification'

const EMPTY: NotificationFeed = { items: [], unreadCount: 0 }
const QUERY_KEY = ['notifications']

/** A followed channel can go live at any moment, so the bell re-checks. */
const REFETCH_MS = 60_000

/**
 * The notification bell's feed.
 *
 * Only runs while signed in — the endpoint is a 401 otherwise, and there's
 * nothing personal to show. "Mark all read" takes the refreshed feed straight
 * from the response instead of invalidating and re-fetching.
 */
export function useNotifications() {
  const { isAuthenticated } = storeToRefs(useAuthStore())
  const client = useQueryClient()

  const query = useQuery({
    queryKey: QUERY_KEY,
    enabled: isAuthenticated,
    refetchInterval: REFETCH_MS,
    queryFn: () => $fetch<NotificationFeed>('/api/notifications')
  })

  const markAllRead = useMutation({
    mutationFn: () => $fetch<NotificationFeed>('/api/notifications/read', { method: 'POST' }),
    onSuccess: (feed) => client.setQueryData(QUERY_KEY, feed)
  })

  return {
    feed: computed(() => query.data.value ?? EMPTY),
    isPending: query.isPending,
    isError: query.isError,
    refetch: query.refetch,
    markAllRead
  }
}
