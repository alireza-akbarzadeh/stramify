import { describe, expect, it } from 'vitest'
import { formatUptime } from './format'

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000)

describe('formatUptime', () => {
  it('reports minutes under an hour', () => {
    expect(formatUptime(minutesAgo(9))).toBe('9m')
  })

  it('reports hours and minutes past an hour', () => {
    expect(formatUptime(minutesAgo(197))).toBe('3h 17m')
  })

  it('clamps a future start time to zero', () => {
    expect(formatUptime(minutesAgo(-5))).toBe('0m')
  })
})
