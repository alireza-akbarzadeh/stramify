import { expect, test } from '@playwright/test'

test('live directory lists channels that are streaming now', async ({ page }) => {
  await page.goto('/live')
  await expect(page.getByRole('heading', { name: /live now/i, level: 1 })).toBeVisible()
  await expect(page.getByRole('article').first()).toBeVisible()
})

test('live directory filters channels by category', async ({ page }) => {
  await page.goto('/live')
  await page.getByRole('tab', { name: 'Music' }).click()
  await expect(page.getByRole('article')).not.toHaveCount(0)
  await expect(page.getByRole('article').first().getByText('Music')).toBeVisible()
})
