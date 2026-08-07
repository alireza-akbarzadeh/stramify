import { describe, expect, it } from 'vitest'
import { toChannelDisplayName, toChannelHandle, toChannelPath, toChannelTag } from './channel'

describe('channel handles', () => {
  it('canonicalises the casing creators actually type', () => {
    expect(toChannelHandle('Canvas_Queen')).toBe('canvas_queen')
    expect(toChannelHandle('canvas_queen')).toBe('canvas_queen')
    expect(toChannelHandle('  Viper_Squadron  ')).toBe('viper_squadron')
  })

  it('builds the same path from a handle or a raw creator name', () => {
    expect(toChannelPath('Canvas_Queen')).toBe('/channel/canvas_queen')
    expect(toChannelPath('canvas_queen')).toBe(toChannelPath('Canvas_Queen'))
  })

  it('escapes handles so they cannot break out of the path segment', () => {
    expect(toChannelPath('a/b')).toBe('/channel/a%2Fb')
  })

  it('tags a handle for display', () => {
    expect(toChannelTag('Canvas_Queen')).toBe('@canvas_queen')
  })

  it('keeps the creator casing but drops separators in fallback names', () => {
    expect(toChannelDisplayName('Viper_Squadron')).toBe('Viper Squadron')
    expect(toChannelDisplayName('slow-render')).toBe('slow render')
    expect(toChannelDisplayName('EchoCollective')).toBe('EchoCollective')
  })
})
