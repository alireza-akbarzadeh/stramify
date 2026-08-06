import { expect, test } from '@playwright/test'

test('category index lists categories and links into a detail page', async ({ page }) => {
  await page.goto('/category')
  await expect(page).toHaveTitle(/Categories — Streamify/)

  const cards = page.getByRole('link', { name: /^Browse / })
  await expect(cards.first()).toBeVisible()

  await cards.first().click()
  await expect(page).toHaveURL(/\/category\/(music|gaming|creative)$/)

  // Detail page renders its header plus either clips or the empty state.
  const heading = page.getByRole('heading', { level: 1 })
  await expect(heading).toBeVisible()

  const clipPlayButtons = page.getByRole('button', { name: /^Play / })
  const emptyState = page.getByText('No clips here yet')
  await expect(clipPlayButtons.first().or(emptyState)).toBeVisible()
})

test('unknown category slug renders a not-found state, not a crash', async ({ page }) => {
  await page.goto('/category/podcasts')
  await expect(page.getByRole('heading', { name: 'Category not found' })).toBeVisible()
})
