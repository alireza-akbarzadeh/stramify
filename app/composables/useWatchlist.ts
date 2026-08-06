import type { WatchlistItem } from '#shared/types/discovery'

const STORAGE_KEY = 'streamify.watchlist.v1'

/**
 * Persists saved clips/live channels to localStorage, synced across tabs.
 * `initOnMounted` keeps the SSR/first-paint value at the default ([]) and
 * only reads the real persisted value after mount, so hydration never
 * mismatches; `hydrated` mirrors that for UI copy ("Loading…" vs counts).
 */
export function useWatchlist() {
  const items = useLocalStorage<WatchlistItem[]>(STORAGE_KEY, [], { initOnMounted: true })
  const hydrated = ref(false)

  onMounted(() => {
    hydrated.value = true
  })

  function isSaved(id: string) {
    return items.value.some((entry) => entry.id === id)
  }

  function toggle(item: WatchlistItem) {
    items.value = isSaved(item.id)
      ? items.value.filter((entry) => entry.id !== item.id)
      : [item, ...items.value]
  }

  function remove(id: string) {
    items.value = items.value.filter((entry) => entry.id !== id)
  }

  function clear() {
    items.value = []
  }

  return { items, hydrated, isSaved, toggle, remove, clear }
}
