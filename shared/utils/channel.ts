/**
 * Channel handles, shared by both sides of the wire.
 *
 * A channel's identity is its handle. `clips.creator`,
 * `live_streams.streamer_name` and `follows.channel` all store it in whatever
 * casing the creator typed (`Canvas_Queen`), so every comparison and every URL
 * goes through `toChannelHandle` to agree on one canonical form.
 */

/** `'Canvas_Queen'` → `'canvas_queen'`. Trims too — handles never have edge space. */
export function toChannelHandle(name: string): string {
  return name.trim().toLowerCase()
}

/** Handle or raw creator name → the channel page URL. */
export function toChannelPath(name: string): string {
  return `/channel/${encodeURIComponent(toChannelHandle(name))}`
}

/**
 * How a handle reads in the UI: `'canvas_queen'` → `'@canvas_queen'`.
 * Display *names* (`Canvas Queen`) come from the `channels` table; this is the
 * secondary line that shows which handle you're actually looking at.
 */
export function toChannelTag(name: string): string {
  return `@${toChannelHandle(name)}`
}

/**
 * Display name for a channel with no `channels` row yet: keep the creator's own
 * casing but turn separators into spaces, so `Viper_Squadron` reads as
 * `Viper Squadron` instead of shouting its slug.
 */
export function toChannelDisplayName(name: string): string {
  return name.trim().replace(/[_-]+/g, ' ')
}
