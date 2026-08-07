import { defineStore, skipHydrate } from 'pinia'
import type { WatchlistItem } from '#shared/types/discovery'

const STORAGE_KEY = 'streamify.watchlist.v1'

/**
 * Saved clips/live channels, persisted to localStorage and shared by every
 * component that reads or writes them (the feed, the live directory, category
 * pages, the watch sidebar).
 *
 * As a store this binds localStorage exactly once. The previous composable ran
 * a fresh `useLocalStorage` per caller — four parallel serialise/parse pipelines
 * and four event listeners for one logical value.
 *
 * `skipHydrate` is required: `items` persists itself, so letting Pinia restore
 * it from the SSR payload would write the server's empty `[]` back over the
 * real stored list before `initOnMounted` gets to read it.
 */
export const useWatchlistStore = defineStore('watchlist', () => {
  // `initOnMounted` keeps the SSR/first-paint value at the default ([]) and only
  // reads the real persisted value after mount, so hydration never mismatches.
  const items = skipHydrate(
    useLocalStorage<WatchlistItem[]>(STORAGE_KEY, [], { initOnMounted: true })
  )

  // Mirrors that read for UI copy ("Loading…" vs counts). Registered after the
  // storage read above, so it only flips once the real value is in place.
  // `tryOnMounted` (not `onMounted`) because a store is instantiated by whichever
  // component asks first — there may be no component instance to bind to.
  const hydrated = ref(false)
  tryOnMounted(() => {
    hydrated.value = true
  })

  const savedClips = computed(() => items.value.filter((entry) => entry.kind === 'clip'))
  const savedLive = computed(() => items.value.filter((entry) => entry.kind === 'live'))

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

  return { items, hydrated, savedClips, savedLive, isSaved, toggle, remove, clear }
})
