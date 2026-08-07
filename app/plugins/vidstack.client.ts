// Registers Vidstack's custom elements. `player/ui` covers the buttons,
// sliders, menus and tooltips the watch player's control bar is built from.
//
// `player/layouts/default` is intentionally not imported — nothing renders
// `media-video-layout` any more (see `components/watch/player/`), so pulling
// it in would only ship a layout bundle nothing mounts.
import 'vidstack/player'
import 'vidstack/player/ui'

export default defineNuxtPlugin(() => {})
