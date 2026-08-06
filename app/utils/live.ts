import { CLIP_CATEGORIES } from '#shared/utils/category'
import type { ClipCategory, LiveSignal } from '#shared/types/discovery'

export type LiveCategory = ClipCategory | 'All Live'

/** Filter tabs for the live directory — "everything" first, then the clip enum. */
export const LIVE_CATEGORIES: readonly LiveCategory[] = ['All Live', ...CLIP_CATEGORIES]

/** Category + free-text filter over live channels. Pure, so it's unit-testable. */
export function filterLiveSignals(
  signals: LiveSignal[],
  category: LiveCategory,
  search: string
): LiveSignal[] {
  const query = search.trim().toLowerCase()
  return signals.filter((signal) => {
    const matchesCategory = category === 'All Live' || signal.category === category
    const haystack = `${signal.name} ${signal.title} ${signal.category}`.toLowerCase()
    return matchesCategory && (!query || haystack.includes(query))
  })
}
