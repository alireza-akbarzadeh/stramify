import type { LiveSignal } from '#shared/types/discovery'

/**
 * Dev fixture data for the live-signals rail. There is no live-streaming
 * backend yet (that lands in Phase 7 — see docs/PROGRESS.md), so this
 * endpoint serves static data shaped like the real response will be. Clips
 * moved off fixtures onto the real `clips` DB table — see
 * server/api/discovery/clips.get.ts and server/db/schema/clips.ts.
 */

const placeholder = (seed: string) => `https://picsum.photos/seed/${seed}/960/540`

export const liveSignals: LiveSignal[] = [
  {
    id: 'live-viper',
    name: 'Viper_Squadron',
    viewers: '8.4k watching',
    image: placeholder('viper-squadron')
  },
  {
    id: 'live-audio',
    name: 'Audio_Ritual',
    viewers: '2.1k watching',
    image: placeholder('audio-ritual')
  },
  {
    id: 'live-neon',
    name: 'Neon_Drift',
    viewers: '1.8k watching',
    image: placeholder('neon-drift')
  },
  {
    id: 'live-briefing',
    name: 'The_Briefing',
    viewers: '920 watching',
    image: placeholder('the-briefing')
  }
]
