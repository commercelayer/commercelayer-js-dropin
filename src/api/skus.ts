import { updateSkus } from '#events/skus'
import type { Sku } from '@commercelayer/sdk'
import { CLSdk } from '#utils/get-sdk'

export function getSkus(sdk: CLSdk) {
  const skus: NodeListOf<HTMLElement> = document.querySelectorAll(
    'cl-sku,cl-variant-option'
  )
  if (skus.length > 0) {
    let allSkus: Sku[] = []
    const skuCodes: string[] = []
    skus.forEach((sku) => {
      const code = sku.getAttribute('code')
      if (code && !skuCodes.includes(code)) {
        skuCodes.push(code)
      }
    })
    sdk.skus
      .list({
        filters: { code_in: skuCodes.join(',') },
      })
      .then(async (skus) => {
        updateSkus(skus)
        allSkus = [...allSkus, ...skus]
        const meta = skus.meta
        if (meta.pageCount > 1) {
          for (
            let pageNumber = meta.currentPage + 1;
            pageNumber <= meta.pageCount;
            pageNumber++
          ) {
            const pageResponse = await sdk.skus.list({
              filters: { code_in: skuCodes.join(',') },
              pageNumber,
            })
            allSkus = [...allSkus, ...pageResponse]
          }
          updateSkus(allSkus)
        }
      })
      .catch((error) => {
        console.log('error', error)
      })
  }
}
