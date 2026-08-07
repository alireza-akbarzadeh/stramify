import { expect, test } from '@playwright/test'

const CLIP = '/watch/clip-midnight-echo'
const LIVE = '/watch/Viper_Squadron'

test('clip watch page renders the player, metadata and comments', async ({ page }) => {
  await page.goto(CLIP)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Midnight Echo')
  await expect(page.locator('media-player')).toBeVisible()
  await expect(page.getByRole('heading', { name: /comments/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Up next' })).toBeVisible()
})

test('clip playback advances', async ({ page }) => {
  await page.goto(CLIP)
  const player = page.locator('media-player')
  await expect(player).toBeVisible()
  await player.click()
  await expect
    .poll(async () => player.evaluate((el: HTMLMediaElement & { currentTime: number }) => el.currentTime), {
      timeout: 15_000
    })
    .toBeGreaterThan(0)
})

test('live watch page shows the live badge and chat instead of comments', async ({ page }) => {
  await page.goto(LIVE)
  await expect(page.getByRole('heading', { name: 'Live chat' })).toBeVisible()
  await expect(page.getByRole('log', { name: /live chat messages/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /comments/i })).toHaveCount(0)
})

test('signed-out viewers get a log-in prompt instead of a chat composer', async ({ page }) => {
  await page.goto(LIVE)
  await expect(page.getByText(/to join the chat/i)).toBeVisible()
  await expect(page.getByRole('textbox', { name: /send a chat message/i })).toHaveCount(0)
})

test('an unknown slug renders the not-available state, not a blank page', async ({ page }) => {
  await page.goto('/watch/definitely-not-a-real-slug')
  await expect(page.getByRole('heading', { name: /couldn't find that video/i })).toBeVisible()
})

test('the old /live/[username] route redirects to the watch page', async ({ page }) => {
  await page.goto('/live/Viper_Squadron')
  await expect(page).toHaveURL(/\/watch\/Viper_Squadron$/)
})

test('clicking a clip in the discovery feed navigates to its watch page', async ({ page }) => {
  await page.goto('/clips')
  await page.getByRole('article').first().getByRole('button', { name: /^Play / }).click()
  await expect(page).toHaveURL(/\/watch\//)
  await expect(page.locator('media-player')).toBeVisible()
})

test('the sidebar stacks below the video on a phone with no horizontal overflow', async ({
  page
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto(CLIP)

  const player = page.locator('media-player')
  const rail = page.getByRole('heading', { name: 'Up next' })
  await expect(player).toBeVisible()
  await expect(rail).toBeVisible()

  const playerBox = await player.boundingBox()
  const railBox = await rail.boundingBox()
  expect(railBox!.y).toBeGreaterThan(playerBox!.y + playerBox!.height)

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  )
  expect(overflow).toBe(false)
})
