import type { MaybeRefOrGetter } from 'vue'

const STORAGE_KEY = 'streamify.watch.counted.v1'

/**
 * Counts a view once per slug per browser session.
 *
 * The guard is `sessionStorage`, so a reload, a scrub back to the start, or a
 * second play of the same clip in one sitting doesn't inflate the number —
 * but coming back tomorrow does count again, which is what a view means.
 * Server-side dedupe by account would be stricter; that needs a `views` table
 * and belongs with the analytics work, not here.
 *
 * Failures are swallowed on purpose: a view count is telemetry, and a dead
 * counter must never break playback.
 */
export function useViewCounter(slug: MaybeRefOrGetter<string>) {
  function counted(): string[] {
    if (import.meta.server) return []
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '[]') as string[]
    } catch {
      return []
    }
  }

  async function count() {
    const key = toValue(slug)
    if (import.meta.server || !key) return

    const seen = counted()
    if (seen.includes(key)) return
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...seen, key]))

    await $fetch(`/api/watch/${encodeURIComponent(key)}/view`, { method: 'POST' }).catch(() => {})
  }

  return { count }
}
