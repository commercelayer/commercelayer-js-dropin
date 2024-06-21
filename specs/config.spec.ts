import { test, expect } from '@playwright/test'
import DropinPage from './models/Page'

test.describe('Configuration', () => {
  test('Miss params required', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      const msg = dialog.message()
      await dialog.dismiss()
      await expect(msg).toEqual(
        'clientId, endpoint, and scope are required to init Commerce Layer.'
      )
    })
    const dropin = new DropinPage(page)
    await dropin.navigate('configuration/miss-params')
  })
  test('Wrong credentials', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      const msg = dialog.message()
      await dialog.dismiss()
      await expect(msg).toEqual(
        'Client authentication failed (e.g., unknown client, no client authentication included, or unsupported authentication method).'
      )
    })
    const dropin = new DropinPage(page)
    await dropin.navigate('configuration/wrong-credentials')
  })
})
