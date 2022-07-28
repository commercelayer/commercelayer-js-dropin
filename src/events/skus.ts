import type { Sku } from '@commercelayer/sdk'

export function updateSkus(skus: Sku[]) {
  skus.forEach((sku) => {
    const code = sku?.code
    if (code) {
      const detail = {
        [code]: {
          ...sku,
        },
      }
      document.dispatchEvent(
        new CustomEvent(`cl:skus:${code}:loaded`, { detail })
      )
    }
  })
  document.dispatchEvent(new CustomEvent(`cl:skus:loaded`))
}
