import { describe, expect, it } from 'vitest'
import { filterLiveSignals } from './live'
import type { LiveSignal } from '#shared/types/discovery'

const signal = (overrides: Partial<LiveSignal>): LiveSignal => ({
  id: 'live-1',
  name: 'Viper_Squadron',
  title: 'Ranked ladder push',
  category: 'Gaming',
  viewers: '8.4k watching',
  uptime: '3h 17m',
  image: 'https://example.test/thumb.jpg',
  videoUrl: 'https://example.test/stream.m3u8',
  ...overrides
})

const signals = [
  signal({}),
  signal({ id: 'live-2', name: 'Patch_Bay', title: 'Modular jam', category: 'Music' })
]

describe('filterLiveSignals', () => {
  it('returns everything for the "All Live" tab with no query', () => {
    expect(filterLiveSignals(signals, 'All Live', '')).toHaveLength(2)
  })

  it('filters by category', () => {
    expect(filterLiveSignals(signals, 'Music', '').map((s) => s.id)).toEqual(['live-2'])
  })

  it('matches the search query against streamer name and stream title', () => {
    expect(filterLiveSignals(signals, 'All Live', '  MODULAR ').map((s) => s.id)).toEqual(['live-2'])
    expect(filterLiveSignals(signals, 'All Live', 'viper').map((s) => s.id)).toEqual(['live-1'])
  })
})
