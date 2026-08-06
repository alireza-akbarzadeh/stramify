import type { Clip, LiveSignal } from '#shared/types/discovery'

/**
 * Dev fixture data for the discovery/highlights feed. There is no clips or
 * live-stream backend yet (that lands in Phase 6/7 — see docs/PROGRESS.md),
 * so these endpoints serve static data shaped like the real response will
 * be. Swap the bodies for real DB/Cloudflare Stream queries when that
 * subsystem exists; the route contracts should not need to change.
 */

const placeholder = (seed: string) => `https://picsum.photos/seed/${seed}/960/540`

export const featuredClip: Clip = {
  id: 'clip-midnight-echo',
  title: 'The Midnight Echo: Unrehearsed Encore at Tokyo Dome',
  creator: 'EchoCollective',
  category: 'Music',
  age: 'Now',
  views: '12.4k watching',
  duration: '02:45',
  image: placeholder('midnight-echo')
}

export const discoveryClips: Clip[] = [
  {
    id: 'clip-triple-kill',
    title: 'The Perfect Triple-Kill Flank',
    creator: 'GhostOperator',
    category: 'Gaming',
    age: '2h ago',
    views: '14.2k views',
    duration: '00:45',
    image: placeholder('triple-kill')
  },
  {
    id: 'clip-modular-synthesis',
    title: 'Modular Synthesis Peak Moment',
    creator: 'Patch_Bay',
    category: 'Music',
    age: '4h ago',
    views: '8.9k views',
    duration: '01:20',
    image: placeholder('modular-synthesis')
  },
  {
    id: 'clip-rendering',
    title: 'Rendering the Final Details',
    creator: 'Canvas_Queen',
    category: 'Creative',
    age: '1h ago',
    views: '22.1k views',
    duration: '03:12',
    image: placeholder('rendering-details')
  },
  {
    id: 'clip-golden-hour',
    title: 'Chasing the Golden Hour Light',
    creator: 'Sky_High',
    category: 'Creative',
    age: '5h ago',
    views: '1.5k views',
    duration: '00:58',
    image: placeholder('golden-hour')
  }
]

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
