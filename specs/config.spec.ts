import { test, expect } from '@playwright/test'

test.describe('Configuration', () => {
  test('Miss params required', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      const msg = dialog.message()
      await dialog.dismiss()
      await expect(msg).toEqual(
        'clientId, endpoint, and scope are required to init Commerce Layer.'
      )
    })
    await page.goto('/specs/html/configuration/miss-params.html')
  })
  test('Wrong credentials', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      const msg = dialog.message()
      await dialog.dismiss()
      await expect(msg).toEqual(
        'Client authentication failed (e.g., unknown client, no client authentication included, or unsupported authentication method).'
      )
    })
    await page.goto('/specs/html/configuration/wrong-credentials.html')
  })
})
