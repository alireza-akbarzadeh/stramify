import { expect, test } from '@playwright/test'

const CHANNEL = '/channel/canvas_queen'

test('the directory ranks channels and links into a channel page', async ({ page }) => {
  await page.goto('/channels')
  await expect(page).toHaveTitle(/Channels — Streamify/)

  const cards = page.getByRole('article')
  await expect(cards.first()).toBeVisible()

  await cards.first().getByRole('link').first().click()
  await expect(page).toHaveURL(/\/channel\/[a-z0-9_-]+$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})

test('"most viewed" and "most followers" really reorder the grid', async ({ page }) => {
  // Checked through the API rather than the DOM: a failure then names the
  // ordering that broke instead of pointing at a card that moved.
  const order = async (sort: string) =>
    page.request
      .get(`/api/channels?sort=${sort}`)
      .then((res) => res.json())
      .then((rows: { handle: string; totalViews: string; followerCount: number }[]) => rows)

  const byFollowers = await order('followers')
  expect(byFollowers.length).toBeGreaterThan(1)
  for (let i = 1; i < byFollowers.length; i += 1) {
    expect(byFollowers[i - 1]!.followerCount).toBeGreaterThanOrEqual(byFollowers[i]!.followerCount)
  }

  const byViews = await order('views')
  const asNumber = (value: string) =>
    value.endsWith('k') ? Number.parseFloat(value) * 1000 : Number(value)
  for (let i = 1; i < byViews.length; i += 1) {
    expect(asNumber(byViews[i - 1]!.totalViews)).toBeGreaterThanOrEqual(
      asNumber(byViews[i]!.totalViews)
    )
  }

  // The two orders disagree — otherwise the sort control is decorative.
  expect(byFollowers.map((c) => c.handle)).not.toEqual(byViews.map((c) => c.handle))
})

test('"live now" puts channels that are actually streaming first', async ({ page }) => {
  const rows = await page.request
    .get('/api/channels?sort=live')
    .then((res) => res.json())
    .then((data: { isLive: boolean }[]) => data)

  const lastLive = rows.map((row) => row.isLive).lastIndexOf(true)
  const firstOffline = rows.map((row) => row.isLive).indexOf(false)
  if (lastLive !== -1 && firstOffline !== -1) expect(lastLive).toBeLessThan(firstOffline)
})

test('search narrows the directory', async ({ page }) => {
  await page.goto('/channels')
  await page.getByRole('textbox', { name: /search channels/i }).fill('canvas')
  await expect(page.getByRole('article')).toHaveCount(1)
  await expect(page.getByRole('article').first()).toContainText('Canvas Queen')
})

test('a channel page shows identity, stats and its videos', async ({ page }) => {
  await page.goto(CHANNEL)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Canvas Queen')
  await expect(page.getByText('@canvas_queen')).toBeVisible()

  await page.getByRole('button', { name: 'Videos' }).click()
  await expect(page).toHaveURL(/tab=videos/)
  await expect(page.getByRole('button', { name: /^Play / }).first()).toBeVisible()
})

test('the About tab is deep-linkable', async ({ page }) => {
  await page.goto(`${CHANNEL}?tab=about`)
  await expect(page.getByRole('heading', { name: 'About' })).toBeVisible()
  await expect(page.getByText('Followers')).toBeVisible()
})

test('sorting a channel’s videos reorders them', async ({ page }) => {
  const videos = async (sort: string) =>
    page.request
      .get(`/api/channels/canvas_queen/videos?sort=${sort}`)
      .then((res) => res.json())
      .then((clips: { id: string }[]) => clips.map((clip) => clip.id))

  const latest = await videos('latest')
  expect(latest.length).toBeGreaterThan(1)
  expect(await videos('oldest')).toEqual([...latest].reverse())
})

test('the watch page links to the uploader’s channel', async ({ page }) => {
  await page.goto('/watch/clip-rendering')
  await page.getByRole('link', { name: /Canvas_Queen/ }).first().click()
  await expect(page).toHaveURL(/\/channel\/canvas_queen/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Canvas Queen')
})

test('an unknown handle renders a not-found state, not a crash', async ({ page }) => {
  await page.goto('/channel/definitely-not-a-real-channel')
  await expect(page.getByRole('heading', { name: /Nothing is published under/i })).toBeVisible()
})

test('signed-out follow attempts are refused with a prompt, not a silent no-op', async ({
  page
}) => {
  await page.goto('/channels')
  await page.getByRole('button', { name: /^Follow / }).first().click()
  await expect(page.getByText(/log in to follow/i)).toBeVisible()
})

test('the channel page has no horizontal overflow on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto(CHANNEL)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  )
  expect(overflow).toBe(false)
})
