import type { Price } from '@commercelayer/sdk'

export const updatePrices = (prices: Price[]) => {
  prices.forEach((price) => {
    const code = price?.sku_code
    if (code) {
      let formattedCompareAmount = ''
      if (price?.compare_at_amount_cents && price?.amount_cents) {
        if (
          price.compare_at_amount_cents > price.amount_cents &&
          price?.formatted_compare_at_amount
        ) {
          formattedCompareAmount = price.formatted_compare_at_amount
        }
      }
      const detail = {
        [code]: {
          formattedAmount: price?.formatted_amount,
          formattedCompareAmount,
        },
      }
      document.dispatchEvent(
        new CustomEvent(`cl:price:${code}:loaded`, { detail })
      )
    }
  })
}
