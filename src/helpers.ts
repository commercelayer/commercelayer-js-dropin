import { OrderCollection } from '@commercelayer/js-sdk'

export const itemsPerPage: number = 25
export const enableElement = (element: HTMLElement) => {
  if (element) {
    element.removeAttribute('disabled')
    element.classList.remove('disabled')
  }
}

export const disableElement = (element: HTMLElement) => {
  if (element) {
    element.setAttribute('disabled', 'disabled')
    element.classList.add('disabled')
  }
}

export const displayElement = (element: HTMLElement) => {
  if (element) {
    element.style.display = 'block'
  }
}

export const hideElement = (element: HTMLElement) => {
  if (element) {
    element.style.display = 'none'
  }
}

export const setElementHTML = (
  parent: HTMLElement,
  selector: string,
  html: string
) => {
  const element = parent.querySelector(selector)
  if (element) {
    element.innerHTML = html
  }
}

export const shoppingBagItemsQuantity = (order: OrderCollection): string => {
  let count = 0
  const lineItems = order
    ?.lineItems()
    ?.toArray()
    .filter((i) =>
      ['skus', 'giftCards', 'adjustments', 'bundles'].includes(i.itemType)
    )
  // @ts-ignore
  const countItems = Number(lineItems?.length)
  if (countItems > 0 && lineItems) {
    // @ts-ignore
    lineItems.map((l) => {
      count = count + l.quantity
    })
  }
  return `${count}`
}

export const updateShoppingBagItemsCount = (order: OrderCollection) => {
  let shoppingBagItemsCounts = document.querySelectorAll(
    '.clayer-shopping-bag-items-count'
  )
  shoppingBagItemsCounts.forEach((shoppingBagItemsCount) => {
    shoppingBagItemsCount.innerHTML = shoppingBagItemsQuantity(order)
  })
}

export const updateShoppingBagTotal = (order: OrderCollection) => {
  let shoppingBagTotals = document.querySelectorAll(
    '.clayer-shopping-bag-total'
  )
  shoppingBagTotals.forEach((shoppingBagTotal) => {
    shoppingBagTotal.innerHTML = order.formattedTotalAmountWithTaxes
  })
}

export const updateShoppingBagSubtotal = (order: OrderCollection) => {
  let shoppingBagSubtotals = document.querySelectorAll(
    '.clayer-shopping-bag-subtotal'
  )
  shoppingBagSubtotals.forEach((shoppingBagSubtotal) => {
    shoppingBagSubtotal.innerHTML = order.formattedSubtotalAmount
  })
}

export const updateShoppingBagShipping = (order: OrderCollection) => {
  let shoppingBagShippings = document.querySelectorAll(
    '.clayer-shopping-bag-shipping'
  )
  shoppingBagShippings.forEach((shoppingBagShipping) => {
    shoppingBagShipping.innerHTML = order.formattedShippingAmount
  })
}

export const updateShoppingBagPayment = (order: OrderCollection) => {
  let shoppingBagPayments = document.querySelectorAll(
    '.clayer-shopping-bag-payment'
  )
  shoppingBagPayments.forEach((shoppingBagPayment) => {
    shoppingBagPayment.innerHTML = order.formattedPaymentMethodAmount
  })
}

export const updateShoppingBagTaxes = (order: OrderCollection) => {
  let shoppingBagTaxes = document.querySelectorAll('.clayer-shopping-bag-taxes')
  shoppingBagTaxes.forEach((shoppingBagTax) => {
    shoppingBagTax.innerHTML = order.formattedTotalTaxAmount
  })
}

export const updateShoppingBagDiscount = (order: OrderCollection) => {
  let shoppingBagDiscounts = document.querySelectorAll(
    '.clayer-shopping-bag-discount'
  )
  shoppingBagDiscounts.forEach((shoppingBagDiscount) => {
    shoppingBagDiscount.innerHTML = order.formattedDiscountAmount
  })
}
