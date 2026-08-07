import type { Clip, LiveSignal, WatchlistItem } from '#shared/types/discovery'
import type { RelatedItem, WatchTarget } from '#shared/types/watch'

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

/** Whatever the watch page is currently showing → watchlist entry. */
export function watchTargetToItem(target: WatchTarget): WatchlistItem {
  return {
    id: target.id,
    kind: target.kind,
    title: target.title,
    creator: target.channel,
    meta:
      target.kind === 'live'
        ? `${target.viewers} · live ${target.uptime}`
        : `${target.duration} · ${target.views}`,
    image: target.image,
    videoUrl: target.videoUrl
  }
}

/** Up-next rail entry → watchlist entry. `meta` is already display-formatted. */
export function relatedToItem(item: RelatedItem): WatchlistItem {
  return {
    id: item.id,
    kind: item.kind,
    title: item.title,
    creator: item.channel,
    meta: item.meta,
    image: item.image,
    videoUrl: item.videoUrl
  }
}
