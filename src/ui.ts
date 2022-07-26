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
import config from './config'
import { getAccessTokenCookie } from './utils'
import type { Sku, Order } from '@commercelayer/sdk'
import { ElementType, SkuInventory, Level } from './@types/ui'

type UpdatePriceArgs = {
  sku: Sku
  querySelector: string | undefined
}

export const updatePrice = ({
  sku,
  querySelector = 'cl-price',
}: UpdatePriceArgs) => {
  const [price] = sku.prices || []
  const priceContainer = document.querySelector(`${querySelector}`)
  if (priceContainer) {
    priceContainer.setAttribute('data-sku-code', sku.code as string)
    if (price) {
      const priceAmount = priceContainer.querySelector(
        '.amount, [data-type-element=amount]'
      )
      if (priceAmount && price?.formatted_amount) {
        priceAmount.innerHTML = price.formatted_amount
      }
      const priceCompareAmount = priceContainer.querySelector(
        '.compare-at-amount, [data-type-element=compare-at-amount]'
      )
      if (
        priceCompareAmount &&
        price?.compare_at_amount_cents &&
        price?.amount_cents &&
        price.formatted_compare_at_amount
      ) {
        if (price.compare_at_amount_cents > price.amount_cents) {
          priceCompareAmount.innerHTML = price.formatted_compare_at_amount
        } else {
          priceCompareAmount.innerHTML = ''
        }
      }
    }
  }
}

type UpdateVariantsArgs = {
  skusReferral: string[]
  skus: Sku[]
  elementType?: ElementType
  clear?: boolean
}

export const updateVariants = ({
  skus,
  elementType = 'variant',
  clear,
  skusReferral,
}: UpdateVariantsArgs) => {
  if (clear === true || elementType === 'add-to-bag-quantity') {
    const allVariants: NodeListOf<HTMLElement> = document.querySelectorAll(
      `[data-element-type=${elementType}], .clayer-${elementType}`
    )
    allVariants.forEach((variant) => {
      disableElement(variant)
    })
  }
  skusReferral.forEach((ref) => {
    const [variant]: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
      `.clayer-${elementType}[data-sku-code="${ref}"], [data-element-type=${elementType}][data-sku-code="${ref}"]`
    )
    const [sku] = skus.filter(({ code }) => code === ref)
    if (variant) {
      if (sku) {
        variant.value = sku.id
        variant.setAttribute('data-sku-id', sku.id)
        enableElement(variant)
      } else {
        disableElement(variant)
      }
    }
  })
}

// export const updateVariantsQuantity = (skus: Sku[]) => {
//   let allAddVariantQuantity: NodeListOf<HTMLElement> =
//     document.querySelectorAll('.clayer-add-to-bag-quantity')
//   allAddVariantQuantity.forEach((addVariantQuantity) => {
//     disableElement(addVariantQuantity)
//   })
//   skus.forEach((sku) => {
//     const code = sku.code
//     let addVariantsQuantity: NodeListOf<HTMLElement> =
//       document.querySelectorAll(
//         '.clayer-add-to-bag-quantity[data-sku-code="' + sku.code + '"]'
//       )
//     addVariantsQuantity.forEach((addVariantQuantity) => {
//       addVariantQuantity.dataset['skuId'] = sku.id
//       enableElement(addVariantQuantity)
//     })
//   })
// }

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

export const updateAddToBags = (skus: Sku[]) => {
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

type UpdateAvailabilityMessageArgs = {
  inventory: SkuInventory
  querySelector: string | undefined
}

export const updateAvailabilityMessage = ({
  inventory,
  querySelector = '[data-element-type=availability-template]',
}: UpdateAvailabilityMessageArgs) => {
  const availabilityMessageContainer: HTMLElement | null =
    document.querySelector(`${querySelector}`)
  if (availabilityMessageContainer) {
    const first_level = getInventoryFirstAvailableLevel(inventory)
    if (first_level?.quantity && first_level.quantity > 0) {
      displayAvailableMessage(availabilityMessageContainer, first_level)
    } else {
      displayUnavailableMessage(availabilityMessageContainer)
    }
  }
}

export const displayAvailableMessage = (
  container: HTMLElement,
  stockLevel: Level
) => {
  const [dlt] = stockLevel?.delivery_lead_times || []
  const qty = stockLevel?.quantity || 0
  const minDays = dlt ? dlt.min.days : ''
  const maxDays = dlt ? dlt.max.days : ''
  const minHours = dlt ? dlt.min.hours : ''
  const maxHours = dlt ? dlt.max.hours : ''
  const shippingMethodName = dlt ? dlt.shipping_method?.name : ''
  const shippingMethodPrice = dlt
    ? dlt.shipping_method?.formatted_price_amount
    : ''
  if (container) {
    // TODO: Replace id and class with data-element-type
    const template = document.querySelector(
      '#clayer-availability-message-available-template, [data-element-type=availability-template]'
    )
    if (template && dlt) {
      const element = getElementFromTemplate(template)
      setElementHTML(
        element,
        '.clayer-availability-message-available-qty, [data-element-type=availability-quantity]',
        qty
      )
      setElementHTML(
        element,
        '.clayer-availability-message-available-min-days, [data-element-type=availability-min-days]',
        minDays
      )
      setElementHTML(
        element,
        '.clayer-availability-message-available-max-days, [data-element-type=availability-max-days]',
        maxDays
      )
      setElementHTML(
        element,
        '.clayer-availability-message-available-min-hours, [data-element-type=availability-min-hours]',
        minHours
      )
      setElementHTML(
        element,
        '.clayer-availability-message-available-max-hours, [data-element-type=availability-max-hours]',
        maxHours
      )
      setElementHTML(
        element,
        '.clayer-availability-message-available-shipping-method-name, [data-element-type=availability-shipping-method-name]',
        shippingMethodName
      )
      setElementHTML(
        element,
        '.clayer-availability-message-available-shipping-method-price, [data-element-type=availability-shipping-method-price]',
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

export const updateShoppingBagSummary = (order: Order) => {
  updateShoppingBagItemsCount(order)
  updateShoppingBagTotal(order)
  updateShoppingBagSubtotal(order)
  updateShoppingBagShipping(order)
  updateShoppingBagPayment(order)
  updateShoppingBagTaxes(order)
  updateShoppingBagDiscount(order)
}
export const updateShoppingBagCheckout = (order: Order) => {
  let shoppingBagCheckouts: NodeListOf<HTMLAnchorElement> =
    document.querySelectorAll('.clayer-shopping-bag-checkout')
  shoppingBagCheckouts.forEach((shoppingBagCheckout) => {
    // @ts-ignore
    if (!order.lineItems()?.empty()) {
      enableElement(shoppingBagCheckout)
      const orderId = getOrderToken()
      const accessToken = getAccessTokenCookie()
      const [_protocol, slug] = config.baseUrl.match(
        /[A-Za-z0-9](?:[A-Za-z0-9\-]{0,61}[A-Za-z0-9])?/g
      ) as string[]
      shoppingBagCheckout.href =
        // @ts-ignore
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
