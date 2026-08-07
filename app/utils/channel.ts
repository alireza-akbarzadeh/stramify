/**
 * A stable colour per channel, so the same person is the same colour
 * everywhere: avatar fallback, banner fallback, tab underline.
 *
 * Sum of char codes → hue. Cheap and deterministic; collisions are cosmetic
 * only. Lives here rather than inside `ChannelAvatar.vue` because the channel
 * page tints its fallback banner with the same hue as the avatar sitting on it.
 */
export function channelHue(name: string): number {
  let total = 0
  for (const char of name) total += char.charCodeAt(0)
  return total % 360
}

/** The avatar/banner fallback gradient for a channel, as a CSS value. */
export function channelGradient(name: string, lightness = 0.62): string {
  const hue = channelHue(name)
  return `linear-gradient(135deg, oklch(${lightness} 0.19 ${hue}), oklch(${lightness - 0.1} 0.21 ${(hue + 40) % 360}))`
}
