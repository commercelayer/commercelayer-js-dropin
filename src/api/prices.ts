import { updatePrices } from '#events/prices'
import type { Price } from '@commercelayer/sdk'
import { CLSdk } from 'src/utils/get-sdk'

export function getPrices(sdk: CLSdk) {
  const prices: NodeListOf<HTMLElement> = document.querySelectorAll('cl-price')
  if (prices.length > 0) {
    let allPrices: Price[] = []
    const skuCodes: string[] = []
    prices.forEach((price) => {
      const code = price.getAttribute('code')
      if (code && !skuCodes.includes(code)) {
        skuCodes.push(code)
      }
    })
    sdk.prices
      .list({
        filters: { sku_code_in: skuCodes.join(',') },
      })
      .then(async (prices) => {
        updatePrices(prices)
        allPrices = [...allPrices, ...prices]
        const meta = prices.meta
        if (meta.pageCount > 1) {
          for (
            let pageNumber = meta.currentPage + 1;
            pageNumber <= meta.pageCount;
            pageNumber++
          ) {
            const pageResponse = await sdk.prices.list({
              filters: { sku_code_in: skuCodes.join(',') },
              pageNumber,
            })
            allPrices = [...allPrices, ...pageResponse]
          }
          updatePrices(allPrices)
        }
      })
      .catch((error) => {
        console.log('error', error)
      })
  }
}
