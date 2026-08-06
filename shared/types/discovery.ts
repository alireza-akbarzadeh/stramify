export type ClipCategory = 'Music' | 'Gaming' | 'Creative'

export interface Clip {
  id: string
  title: string
  creator: string
  category: ClipCategory
  age: string
  views: string
  duration: string
  image: string
}

export interface LiveSignal {
  id: string
  name: string
  viewers: string
  image: string
}

export type WatchlistKind = 'clip' | 'live'

export interface WatchlistItem {
  id: string
  kind: WatchlistKind
  title: string
  creator: string
  /** Short secondary line shown under the title, e.g. "02:45 · 12.4k views" or "8.4k watching". */
  meta: string
  image: string
}
