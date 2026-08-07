import { describe, expect, it } from 'vitest'
import {
  addSeries,
  dayWindow,
  fillDailySeries,
  rangeToDays,
  sumPoints,
  toIsoDay,
  toPercentShares,
  toSeries
} from './trend'

/** Fixed clock so the window assertions don't drift with the real date. */
const NOW = new Date('2026-08-07T13:45:00.000Z')

describe('toIsoDay', () => {
  it('reduces a Date to a UTC calendar day', () => {
    expect(toIsoDay(new Date('2026-08-07T23:59:59.000Z'))).toBe('2026-08-07')
  })

  it('accepts an ISO string', () => {
    expect(toIsoDay('2026-01-02T00:00:00.000Z')).toBe('2026-01-02')
  })
})

describe('dayWindow', () => {
  it('ends on today and runs oldest first', () => {
    expect(dayWindow(3, NOW)).toEqual(['2026-08-05', '2026-08-06', '2026-08-07'])
  })

  it('crosses a month boundary', () => {
    expect(dayWindow(3, new Date('2026-09-01T10:00:00.000Z'))).toEqual([
      '2026-08-30',
      '2026-08-31',
      '2026-09-01'
    ])
  })
})

describe('fillDailySeries', () => {
  it('fills days with no rows with zero', () => {
    const points = fillDailySeries([{ day: '2026-08-07', value: 4 }], 3, NOW)
    expect(points).toEqual([
      { date: '2026-08-05', value: 0 },
      { date: '2026-08-06', value: 0 },
      { date: '2026-08-07', value: 4 }
    ])
  })

  it('sums multiple rows landing on the same day', () => {
    const points = fillDailySeries(
      [
        { day: '2026-08-06T01:00:00.000Z', value: 2 },
        { day: '2026-08-06T22:00:00.000Z', value: 3 }
      ],
      2,
      NOW
    )
    expect(points).toEqual([
      { date: '2026-08-06', value: 5 },
      { date: '2026-08-07', value: 0 }
    ])
  })

  it('ignores rows outside the window', () => {
    const points = fillDailySeries([{ day: '2026-01-01', value: 99 }], 2, NOW)
    expect(sumPoints(points)).toBe(0)
  })

  it('returns a dense window even with no rows at all', () => {
    expect(fillDailySeries([], 7, NOW)).toHaveLength(7)
  })
})

describe('addSeries', () => {
  it('adds matching days point-wise', () => {
    const a = [
      { date: '2026-08-06', value: 1 },
      { date: '2026-08-07', value: 2 }
    ]
    const b = [
      { date: '2026-08-06', value: 10 },
      { date: '2026-08-07', value: 0 }
    ]
    expect(addSeries(a, b)).toEqual([
      { date: '2026-08-06', value: 11 },
      { date: '2026-08-07', value: 2 }
    ])
  })

  it('treats a day missing from the second series as zero', () => {
    const a = [{ date: '2026-08-07', value: 3 }]
    expect(addSeries(a, [])).toEqual([{ date: '2026-08-07', value: 3 }])
  })
})

describe('toSeries', () => {
  it('carries the total alongside the points', () => {
    const series = toSeries('followers', 'New followers', [
      { date: '2026-08-06', value: 2 },
      { date: '2026-08-07', value: 5 }
    ])
    expect(series).toMatchObject({ key: 'followers', label: 'New followers', total: 7 })
  })
})

describe('rangeToDays', () => {
  it('maps every supported range', () => {
    expect(rangeToDays('7d')).toBe(7)
    expect(rangeToDays('30d')).toBe(30)
    expect(rangeToDays('90d')).toBe(90)
  })
})

describe('toPercentShares', () => {
  it('sums to exactly 100 despite rounding', () => {
    const shares = toPercentShares([1, 1, 1])
    expect(shares.reduce((a, b) => a + b, 0)).toBe(100)
  })

  it('returns all zeroes when there is nothing to share', () => {
    expect(toPercentShares([0, 0])).toEqual([0, 0])
  })

  it('handles a single category as 100%', () => {
    expect(toPercentShares([7])).toEqual([100])
  })

  it('keeps proportions', () => {
    expect(toPercentShares([75, 25])).toEqual([75, 25])
  })
})
