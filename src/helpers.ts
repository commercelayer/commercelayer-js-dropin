export const itemsPerPage: number = 25
export const enableElement = element => {
  if (element) {
    element.removeAttribute('disabled')
    element.classList.remove('disabled')
  }
}

export const disableElement = element => {
  if (element) {
    element.setAttribute('disabled', 'disabled')
    element.classList.add('disabled')
  }
}

export const displayElement = element => {
  if (element) {
    element.style.display = 'block'
  }
}

export const hideElement = element => {
  if (element) {
    element.style.display = 'none'
  }
}

export const setElementHTML = (parent, selector, html) => {
  const element = parent.querySelector(selector)
  if (element) {
    element.innerHTML = html
  }
}

export const updateShoppingBagItemsCount = order => {
  let shoppingBagItemsCounts = document.querySelectorAll(
    '.clayer-shopping-bag-items-count'
  )
  shoppingBagItemsCounts.forEach(function(shoppingBagItemsCount) {
    shoppingBagItemsCount.innerHTML = order.attributes.skus_count
  })
}

export const updateShoppingBagTotal = order => {
  let shoppingBagTotals = document.querySelectorAll(
    '.clayer-shopping-bag-total'
  )
  shoppingBagTotals.forEach(function(shoppingBagTotal) {
    shoppingBagTotal.innerHTML =
      order.attributes.formatted_total_amount_with_taxes
  })
}

export const updateShoppingBagSubtotal = order => {
  let shoppingBagSubtotals = document.querySelectorAll(
    '.clayer-shopping-bag-subtotal'
  )
  shoppingBagSubtotals.forEach(function(shoppingBagSubtotal) {
    shoppingBagSubtotal.innerHTML = order.attributes.formatted_subtotal_amount
  })
}

export const updateShoppingBagShipping = order => {
  let shoppingBagShippings = document.querySelectorAll(
    '.clayer-shopping-bag-shipping'
  )
  shoppingBagShippings.forEach(function(shoppingBagShipping) {
    shoppingBagShipping.innerHTML = order.attributes.formatted_shipping_amount
  })
}

export const updateShoppingBagPayment = order => {
  let shoppingBagPayments = document.querySelectorAll(
    '.clayer-shopping-bag-payment'
  )
  shoppingBagPayments.forEach(function(shoppingBagPayment) {
    shoppingBagPayment.innerHTML =
      order.attributes.formatted_payment_method_amount
  })
}

export const updateShoppingBagTaxes = order => {
  let shoppingBagTaxes = document.querySelectorAll('.clayer-shopping-bag-taxes')
  shoppingBagTaxes.forEach(function(shoppingBagTax) {
    shoppingBagTax.innerHTML = order.attributes.formatted_total_tax_amount
  })
}

export const updateShoppingBagDiscount = order => {
  let shoppingBagDiscounts = document.querySelectorAll(
    '.clayer-shopping-bag-discount'
  )
  shoppingBagDiscounts.forEach(function(shoppingBagDiscount) {
    shoppingBagDiscount.innerHTML = order.attributes.formatted_discount_amount
  })
}
