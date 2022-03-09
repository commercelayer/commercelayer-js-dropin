import * as _ from 'lodash'
import {
  disableElement,
  enableElement,
  setElementHTML,
  displayElement,
  updateShoppingBagItemsCount,
  updateShoppingBagTotal,
  updateShoppingBagSubtotal,
  updateShoppingBagShipping,
  updateShoppingBagPayment,
  updateShoppingBagTaxes,
  updateShoppingBagDiscount,
} from './helpers'
import {
  getInventoryFirstAvailableLevel,
  getElementFromTemplate,
  getOrderToken,
} from './utils'
import { hideElement } from './helpers'
import { OrderCollection, SkuCollection } from '@commercelayer/js-sdk'
import config from './config'
import { getAccessTokenCookie } from './utils'
// const utils = require('./utils')
// const normalize = require('json-api-normalize')

export const updatePrice = (sku: SkuCollection, priceContainerId: string) => {
  const [price] = sku.prices().toArray()
  const priceContainer = document.querySelector(`#${priceContainerId}`)
  if (priceContainer) {
    const priceAmount = priceContainer.querySelector('.amount')
    if (priceAmount && price) {
      priceAmount.innerHTML = price.formattedAmount
    }
    const priceCompareAmount =
      priceContainer.querySelector('.compare-at-amount')
    if (priceCompareAmount && price) {
      if (price.compareAtAmountCents > price.amountCents) {
        priceCompareAmount.innerHTML = price.formattedCompareAtAmount
      } else {
        priceCompareAmount.innerHTML = ''
      }
    }
  }
}

export const updatePrices = (skus: SkuCollection[]) => {
  skus.map((sku) => {
    const price = _.first(sku.prices().toArray())
    const priceAmounts = document.querySelectorAll(
      '[data-sku-code="' + sku.code + '"] > .amount'
    )
    priceAmounts.forEach((priceAmount) => {
      priceAmount.innerHTML = price?.formattedAmount || ''
    })
    const priceCompareAmounts = document.querySelectorAll(
      '[data-sku-code="' + sku.code + '"] > .compare-at-amount'
    )
    priceCompareAmounts.forEach((priceCompareAmount) => {
      if (price && price.compareAtAmountCents > price.amountCents) {
        priceCompareAmount.innerHTML = price.formattedCompareAtAmount
      } else {
        priceCompareAmount.innerHTML = ''
      }
    })
  })
}

export const updateVariants = (skus: SkuCollection[], clear: boolean) => {
  if (clear === true) {
    let allVariants: NodeListOf<HTMLElement> =
      document.querySelectorAll('.clayer-variant')
    allVariants.forEach((variant) => {
      disableElement(variant)
    })
  }
  skus.map((sku) => {
    let variants: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
      '.clayer-variant[data-sku-code="' + sku.code + '"]'
    )
    variants.forEach((variant) => {
      variant.value = sku.id
      enableElement(variant)
    })
  })
}

export const updateVariantsQuantity = (skus: SkuCollection[]) => {
  let allAddVariantQuantity: NodeListOf<HTMLElement> =
    document.querySelectorAll('.clayer-add-to-bag-quantity')
  allAddVariantQuantity.forEach((addVariantQuantity) => {
    disableElement(addVariantQuantity)
  })
  skus.forEach((sku) => {
    let addVariantsQuantity: NodeListOf<HTMLElement> =
      document.querySelectorAll(
        '.clayer-add-to-bag-quantity[data-sku-code="' + sku.code + '"]'
      )
    addVariantsQuantity.forEach((addVariantQuantity) => {
      addVariantQuantity.dataset['skuId'] = sku.id
      enableElement(addVariantQuantity)
    })
  })
}

export const updateAddVariantQuantitySKU = (
  skuId: string,
  skuName: string,
  skuCode: string,
  skuImageUrl: string,
  skuMaxQuantity: string,
  addToBagQuantityId: string
) => {
  let addVariantQuantity: HTMLInputElement | null = document.querySelector(
    `#${addToBagQuantityId}`
  )
  if (addVariantQuantity) {
    const customMax = addVariantQuantity.getAttribute('max')
    const customMin = addVariantQuantity.getAttribute('min')
    const customVal = addVariantQuantity.getAttribute('value')
    addVariantQuantity.dataset['skuId'] = skuId
    addVariantQuantity.value = customVal || customMin || '1'
    addVariantQuantity.min = customMin || '1'
    if (skuName) addVariantQuantity.dataset['skuName'] = skuName
    if (skuCode) addVariantQuantity.dataset['skuCode'] = skuCode
    if (skuImageUrl) addVariantQuantity.dataset['skuImageUrl'] = skuImageUrl
    if (skuMaxQuantity) addVariantQuantity.max = customMax || skuMaxQuantity
  }
}

export const updateAddToBags = (skus: SkuCollection[]) => {
  let allAddToBags: NodeListOf<HTMLElement> =
    document.querySelectorAll('.clayer-add-to-bag')
  allAddToBags.forEach((addToBag) => {
    disableElement(addToBag)
  })
  skus.forEach((sku) => {
    let addToBags: NodeListOf<HTMLElement> = document.querySelectorAll(
      '.clayer-add-to-bag[data-sku-code="' + sku.code + '"]'
    )
    addToBags.forEach((addToBag) => {
      addToBag.dataset['skuId'] = sku.id
      enableElement(addToBag)
    })
  })
}

export const updateAvailabilityMessage = (
  inventory: any,
  availabilityMessageContainerId: string
) => {
  let availabilityMessageContainer: HTMLElement | null = document.querySelector(
    `#${availabilityMessageContainerId}`
  )
  if (availabilityMessageContainer) {
    let first_level = getInventoryFirstAvailableLevel(inventory)
    if (first_level?.quantity > 0) {
      displayAvailableMessage(availabilityMessageContainer, first_level)
    } else {
      displayUnavailableMessage(availabilityMessageContainer)
    }
  }
}

export const displayAvailableMessage = (
  container: HTMLElement,
  stockLevel: any
) => {
  const [dlt]: any = stockLevel?.deliveryLeadTimes || []
  const qty = stockLevel.quantity
  const minDays = dlt ? dlt.min.days : ''
  const maxDays = dlt ? dlt.max.days : ''
  const minHours = dlt ? dlt.min.hours : ''
  const maxHours = dlt ? dlt.max.hours : ''
  const shippingMethodName = dlt ? dlt.shippingMethod.name : ''
  const shippingMethodPrice = dlt ? dlt.shippingMethod.formattedPriceAmount : ''
  if (container) {
    const template = document.querySelector(
      '#clayer-availability-message-available-template'
    )
    if (template && dlt) {
      const element = getElementFromTemplate(template)

      setElementHTML(element, '.clayer-availability-message-available-qty', qty)
      setElementHTML(
        element,
        '.clayer-availability-message-available-min-days',
        minDays
      )
      setElementHTML(
        element,
        '.clayer-availability-message-available-max-days',
        maxDays
      )
      setElementHTML(
        element,
        '.clayer-availability-message-available-min-hours',
        minHours
      )
      setElementHTML(
        element,
        '.clayer-availability-message-available-max-hours',
        maxHours
      )
      setElementHTML(
        element,
        '.clayer-availability-message-available-shipping-method-name',
        shippingMethodName
      )
      setElementHTML(
        element,
        '.clayer-availability-message-available-shipping-method-price',
        shippingMethodPrice
      )

      container.innerHTML = ''
      container.appendChild(element)

      displayElement(container)
    } else {
      container.innerHTML = ''
      displayElement(container)
    }
  }
}

export const updateAddToBagSKU = (
  skuId: string,
  skuName: string,
  skuCode: string,
  skuImageUrl: string,
  addToBagId: string,
  addToBagQuantityId: string,
  skuReference: string
) => {
  let addToBag: HTMLElement | null = document.querySelector(`#${addToBagId}`)
  if (addToBag) {
    addToBag.dataset['skuId'] = skuId
    addToBag.dataset['skuName'] = skuName ?? ''
    addToBag.dataset['skuCode'] = skuCode ?? ''
    addToBag.dataset['skuImageUrl'] = skuImageUrl ?? ''
    addToBag.dataset['addToBagQuantityId'] = addToBagQuantityId ?? ''
    addToBag.dataset['skuReference'] = skuReference ?? ''
  }
}

export const enableAddVariantQuantity = (addToBagQuantityId: string) => {
  let addVariantQuantity: HTMLElement | null = document.querySelector(
    `#${addToBagQuantityId}`
  )
  if (addVariantQuantity) {
    enableElement(addVariantQuantity)
  }
}

export const disableAddVariantQuantity = (addToBagQuantityId: string) => {
  let addVariantQuantity: HTMLElement | null = document.querySelector(
    `#${addToBagQuantityId}`
  )
  if (addVariantQuantity) {
    disableElement(addVariantQuantity)
  }
}

export const enableAddToBag = (addToBagId: string) => {
  let addToBag: HTMLElement | null = document.querySelector(`#${addToBagId}`)
  if (addToBag) {
    enableElement(addToBag)
  }
}

export const disableAddToBag = (addToBagId: string) => {
  let addToBag: HTMLElement | null = document.querySelector(`#${addToBagId}`)
  if (addToBag) {
    disableElement(addToBag)
  }
}

export const toggleShoppingBag = () => {
  let shoppingBagContainer = document.querySelector(
    '#clayer-shopping-bag-container'
  )
  if (shoppingBagContainer) {
    shoppingBagContainer.classList.toggle('open')
  }
  let main = document.querySelector('#clayer-main')
  if (main) {
    main.classList.toggle('open')
  }
}

export const displayUnavailableMessage = (container: HTMLElement) => {
  if (container) {
    let template = document.querySelector(
      '#clayer-availability-message-unavailable-template'
    )
    if (template) {
      let element = getElementFromTemplate(template)
      container.innerHTML = ''
      container.appendChild(element)
      displayElement(container)
    }
  }
}

export const updateShoppingBagSummary = (order: OrderCollection) => {
  updateShoppingBagItemsCount(order)
  updateShoppingBagTotal(order)
  updateShoppingBagSubtotal(order)
  updateShoppingBagShipping(order)
  updateShoppingBagPayment(order)
  updateShoppingBagTaxes(order)
  updateShoppingBagDiscount(order)
}
export const updateShoppingBagCheckout = (order: OrderCollection) => {
  let shoppingBagCheckouts: NodeListOf<HTMLAnchorElement> =
    document.querySelectorAll('.clayer-shopping-bag-checkout')
  shoppingBagCheckouts.forEach((shoppingBagCheckout) => {
    if (!order.lineItems()?.empty()) {
      enableElement(shoppingBagCheckout)
      const orderId = getOrderToken()
      const accessToken = getAccessTokenCookie()
      const [_protocol, slug] = config.baseUrl.match(
        /[A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?/g
      ) as string[]
      shoppingBagCheckout.href =
        order.checkoutUrl ||
        `https://${slug}.checkout.commercelayer.app/${orderId}?accessToken=${accessToken}`
    } else {
      shoppingBagCheckout.href = ''
      disableElement(shoppingBagCheckout)
    }
  })
}

export const clearShoppingBag = () => {
  const element = document.querySelector('#clayer-shopping-bag-items-container')
  if (element) {
    element.innerHTML = ''
  }
}

export const openShoppingBag = () => {
  let shoppingBagContainer = document.querySelector(
    '#clayer-shopping-bag-container'
  )
  if (shoppingBagContainer) {
    shoppingBagContainer.classList.add('open')
  }
  let main = document.querySelector('#clayer-main')
  if (main) {
    main.classList.remove('open')
  }
}

export const hideAvailabilityMessages = () => {
  let allAvailabilityMessageContainers: NodeListOf<HTMLElement> =
    document.querySelectorAll('.clayer-availability-message-container')
  allAvailabilityMessageContainers.forEach((container) => {
    hideElement(container)
  })
}
