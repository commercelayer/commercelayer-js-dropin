import { test, expect } from '@playwright/test'
import DropinPage from './models/Page'

test.describe('Skus', () => {
  const skus = [
    {
      code: 'BABYONBU000000E63E74NBXX',
      img: 'https://img.commercelayer.io/skus/BABYONBU000000E63E74.png?fm=jpg&q=90',
    },
    {
      code: 'BABYONBU000000E63E746MXX',
      img: 'https://img.commercelayer.io/skus/BABYONBU000000E63E74.png?fm=jpg&q=90',
    },
  ]
  test('Show single sku', async ({ page }) => {
    const dropin = new DropinPage(page)
    await dropin.navigate('skus/single-sku', {
      waitUntil: 'domcontentloaded',
    })
    const skuElement = dropin.locator('cl-sku')
    const [sku] = skus
    const { code, img } = sku
    const size = await skuElement.count()
    if (size > 1) {
      for (let i = 0; i < size; i++) {
        const element = skuElement.nth(i)
        expect(element).toHaveAttribute('code', code)
        const fieldElement = element.locator('cl-sku-field')
        const fieldSize = await fieldElement.count()
        for (let j = 0; j < fieldSize; j++) {
          const field = fieldElement.nth(j)
          const fieldName = await field.getAttribute('as')
          if (fieldName === 'img') {
            const imgElement = field.locator('> img')
            await expect(imgElement).toHaveAttribute('src', img)
          } else {
            const childElement = field.locator(`> ${fieldName}`)
            await expect(childElement).not.toBeEmpty()
          }
        }
      }
    }
  })
  test('Show skus', async ({ page }) => {
    const dropin = new DropinPage(page)
    await dropin.navigate('skus/single-sku', {
      waitUntil: 'domcontentloaded',
    })
    for (const sku of skus) {
      const { code, img } = sku
      const skuElement = dropin.locator(`cl-sku[code=${code}]`)
      const size = await skuElement.count()
      if (size > 1) {
        for (let i = 0; i < size; i++) {
          const element = skuElement.nth(i)
          expect(element).toHaveAttribute('code', code)
          const fieldElement = element.locator('cl-sku-field')
          const fieldSize = await fieldElement.count()
          for (let j = 0; j < fieldSize; j++) {
            const field = fieldElement.nth(j)
            const fieldName = await field.getAttribute('as')
            if (fieldName === 'img') {
              const imgElement = field.locator('> img')
              await expect(imgElement).toHaveAttribute('src', img)
            } else {
              const childElement = field.locator(`> ${fieldName}`)
              await expect(childElement).not.toBeEmpty()
            }
          }
        }
      }
    }
  })
})
