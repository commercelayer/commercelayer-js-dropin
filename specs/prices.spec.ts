import { test, expect } from '@playwright/test'
import DropinPage from './models/Page'

test.describe('Prices', () => {
  const prices = [
    {
      code: 'BABYONBU000000E63E74NBXX',
      amount: '€29,00',
      compareAmount: '€37,70',
    },
    {
      code: 'BABYONBU000000E63E746MXX',
      amount: '€29,00',
      compareAmount: '€37,70',
    },
    {
      code: 'BABYONBU000000E63E7412MX',
      amount: '€35,00',
      compareAmount: '€45,00',
    },
  ]
  test('Show single price', async ({ page }) => {
    const dropin = new DropinPage(page)
    await dropin.navigate('prices/single-price', {
      waitUntil: 'domcontentloaded',
    })
    const price = dropin.locator('cl-price')
    const [sku] = prices
    await expect(price).toHaveAttribute('code', sku.code)
    const amount = dropin.locator('cl-price-amount')
    await expect(amount).toContainText(sku.amount)
    const compareAmount = dropin.locator('cl-price-compare-amount')
    await expect(compareAmount).toContainText(sku.compareAmount)
  })
  test('Show prices', async ({ page }) => {
    await page.goto('/specs/html/prices/prices.html', {
      waitUntil: 'domcontentloaded',
    })
    for (const sku of prices) {
      const price = page.locator(`cl-price[code=${sku.code}]`)
      await expect(price).toHaveAttribute('code', sku.code)
      const amount = page.locator(
        `cl-price[code=${sku.code}] > cl-price-amount`
      )
      await expect(amount).toContainText(sku.amount)
      const compareAmount = page.locator(
        `cl-price[code=${sku.code}] > cl-price-compare-amount`
      )
      await expect(compareAmount).toContainText(sku.compareAmount)
    }
  })
})
