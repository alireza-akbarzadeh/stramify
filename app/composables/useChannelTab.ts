import type { WritableComputedRef } from 'vue'

export type ChannelTab = 'home' | 'videos' | 'live' | 'about'

const TABS: ChannelTab[] = ['home', 'videos', 'live', 'about']

/**
 * Which channel section is open, kept in the URL as `?tab=videos`.
 *
 * Query state rather than a plain `ref` so a section is linkable and survives
 * a reload — "look at this channel's About" is a thing people send each other.
 * `replace` keeps the back button meaning "leave this channel" instead of
 * walking back through every tab the visitor tried.
 */
export function useChannelTab(): WritableComputedRef<ChannelTab> {
  const route = useRoute()
  const router = useRouter()

  return computed({
    get: () => {
      const value = String(route.query.tab ?? '')
      return TABS.includes(value as ChannelTab) ? (value as ChannelTab) : 'home'
    },
    set: (tab) => {
      const query = { ...route.query, tab: tab === 'home' ? undefined : tab }
      router.replace({ query })
    }
  })
}
