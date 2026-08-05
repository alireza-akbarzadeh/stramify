import { expect, test } from '@playwright/test'

test('home page loads and renders the primary CTA', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Streamify/)
  await expect(page.getByRole('link', { name: /start streaming/i }).first()).toBeVisible()
})
