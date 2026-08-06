import type { Clip, LiveSignal, WatchlistItem } from '#shared/types/discovery'

/** Clip → watchlist entry. Shared by the discovery feed and category pages. */
export function clipToItem(clip: Clip): WatchlistItem {
  return {
    id: clip.id,
    kind: 'clip',
    title: clip.title,
    creator: clip.creator,
    meta: `${clip.duration} · ${clip.views}`,
    image: clip.image,
    videoUrl: clip.videoUrl
  }
}

/** Live channel → watchlist entry. Shared by the discovery feed and the live directory. */
export function liveToItem(signal: LiveSignal): WatchlistItem {
  return {
    id: signal.id,
    kind: 'live',
    title: signal.title,
    creator: signal.name,
    meta: `${signal.viewers} · live ${signal.uptime}`,
    image: signal.image,
    videoUrl: signal.videoUrl
  }
}
