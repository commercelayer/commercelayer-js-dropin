import { Order } from '@commercelayer/sdk'

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
  html: string | number | undefined
) => {
  const element = parent.querySelector(selector)
  if (element) {
    element.innerHTML = `${html || ''}`
  }
}

export const shoppingBagItemsQuantity = (_order: Order) => {
  // let count = 0
  // const lineItems = order
  //   ?.lineItems()
  //   ?.toArray()
  //   .filter((i) =>
  //     ['skus', 'giftCards', 'adjustments', 'bundles'].includes(i.itemType)
  //   )
  // // @ts-ignore
  // const countItems = Number(lineItems?.length)
  // if (countItems > 0 && lineItems) {
  //   // @ts-ignore
  //   lineItems.map((l) => {
  //     count = count + l.quantity
  //   })
  // }
  // return `${count}`
}

export const updateShoppingBagItemsCount = (_order: Order) => {
  let shoppingBagItemsCounts = document.querySelectorAll(
    '.clayer-shopping-bag-items-count'
  )
  shoppingBagItemsCounts.forEach((_shoppingBagItemsCount) => {
    // shoppingBagItemsCount.innerHTML = shoppingBagItemsQuantity(order)
  })
}

export const updateShoppingBagTotal = (_order: Order) => {
  let shoppingBagTotals = document.querySelectorAll(
    '.clayer-shopping-bag-total'
  )
  shoppingBagTotals.forEach((_shoppingBagTotal) => {
    // shoppingBagTotal.innerHTML = order.formattedTotalAmountWithTaxes
  })
}

export const updateShoppingBagSubtotal = (_order: Order) => {
  let shoppingBagSubtotals = document.querySelectorAll(
    '.clayer-shopping-bag-subtotal'
  )
  shoppingBagSubtotals.forEach((_shoppingBagSubtotal) => {
    // shoppingBagSubtotal.innerHTML = order.formattedSubtotalAmount
  })
}

export const updateShoppingBagShipping = (_order: Order) => {
  let shoppingBagShippings = document.querySelectorAll(
    '.clayer-shopping-bag-shipping'
  )
  shoppingBagShippings.forEach((_shoppingBagShipping) => {
    // shoppingBagShipping.innerHTML = order.formattedShippingAmount
  })
}

export const updateShoppingBagPayment = (_order: Order) => {
  let shoppingBagPayments = document.querySelectorAll(
    '.clayer-shopping-bag-payment'
  )
  shoppingBagPayments.forEach((_shoppingBagPayment) => {
    // shoppingBagPayment.innerHTML = order.formattedPaymentMethodAmount
  })
}

export const updateShoppingBagTaxes = (_order: Order) => {
  let shoppingBagTaxes = document.querySelectorAll('.clayer-shopping-bag-taxes')
  shoppingBagTaxes.forEach((_shoppingBagTax) => {
    // shoppingBagTax.innerHTML = order.formattedTotalTaxAmount
  })
}

export const updateShoppingBagDiscount = (_order: Order) => {
  let shoppingBagDiscounts = document.querySelectorAll(
    '.clayer-shopping-bag-discount'
  )
  shoppingBagDiscounts.forEach((_shoppingBagDiscount) => {
    // shoppingBagDiscount.innerHTML = order.formattedDiscountAmount
  })
}
