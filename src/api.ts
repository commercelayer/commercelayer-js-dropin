// import api from './api' import listeners from './listeners'
import config from './config'
import { Sku, Order, LineItem } from '@commercelayer/js-sdk'
import { itemsPerPage } from './helpers'
import { updateShoppingBagSummary, updateShoppingBagCheckout } from './ui'
import {
  setOrderToken,
  getOrderToken,
  deleteOrderToken,
  getElementFromTemplate
} from './utils'
import {
  updatePrices,
  updateVariants,
  updateVariantsQuantity,
  updateAddToBags,
  updatePrice,
  updateAvailabilityMessage,
  updateAddToBagSKU,
  updateAddVariantQuantitySKU,
  enableAddVariantQuantity,
  enableAddToBag,
  disableAddToBag,
  disableAddVariantQuantity,
  displayUnavailableMessage,
  clearShoppingBag
} from './ui'
// const clsdk = require('@commercelayer/sdk')

const getPrices = () => {
  const prices: NodeListOf<HTMLElement> = document.querySelectorAll(
    '.clayer-price'
  )
  if (prices.length > 0) {
    const skuCodes = []
    prices.forEach(price => {
      skuCodes.push(price.dataset.skuCode)
    })
    Sku.where({ codes: skuCodes.join(',') })
      .includes('prices')
      .perPage(itemsPerPage)
      .all()
      .then(r => {
        updatePrices(r.toArray())
        if (r.hasNextPage()) {
          r.nextPage().then(n => {
            updatePrices(n.toArray())
          })
        }
        if (r.hasPrevPage()) {
          r.prevPage().then(p => {
            updatePrices(p.toArray())
          })
        }
        document.dispatchEvent(new Event('clayer-prices-ready'))

        if (r.empty()) {
          document.dispatchEvent(new Event('clayer-skus-empty'))
        }
      })
  }
}

const getVariants = () => {
  const variants: NodeListOf<HTMLElement> = document.querySelectorAll(
    '.clayer-variant'
  )

  if (variants.length > 0) {
    const skuCodes = []

    variants.forEach(variant => {
      skuCodes.push(variant.dataset.skuCode)
    })

    Sku.where({ codes: skuCodes.join(',') })
      .perPage(itemsPerPage)
      .all()
      .then(r => {
        updateVariants(r.toArray(), true)
        if (r.hasNextPage()) {
          r.nextPage().then(n => {
            updateVariants(r.toArray(), false)
          })
        }
        if (r.hasPrevPage()) {
          r.prevPage().then(p => {
            updateVariants(r.toArray(), false)
          })
        }
        document.dispatchEvent(new Event('clayer-variants-ready'))
      })
  }
}

const getVariantsQuantity = () => {
  const variantQuantity: NodeListOf<HTMLElement> = document.querySelectorAll(
    '.clayer-add-to-bag-quantity'
  )
  if (variantQuantity.length > 0) {
    const skuCodes = []

    variantQuantity.forEach(variant => {
      if (variant.dataset.skuCode) {
        skuCodes.push(variant.dataset.skuCode)
      }
    })

    Sku.where({ codes: skuCodes.join(',') })
      .perPage(itemsPerPage)
      .all()
      .then(r => {
        updateVariantsQuantity(r.toArray())
        if (r.hasNextPage()) {
          r.nextPage().then(n => {
            updateVariantsQuantity(r.toArray())
          })
        }
        if (r.hasPrevPage()) {
          r.prevPage().then(p => {
            updateVariantsQuantity(r.toArray())
          })
        }
        document.dispatchEvent(new Event('clayer-variants-quantity-ready'))
      })
  }
}

const getAddToBags = () => {
  const addToBags: NodeListOf<HTMLElement> = document.querySelectorAll(
    '.clayer-add-to-bag'
  )

  if (addToBags.length > 0) {
    const skuCodes = []

    addToBags.forEach(addToBag => {
      skuCodes.push(addToBag.dataset.skuCode)
    })
    Sku.where({ codes: skuCodes.join(',') })
      .perPage(itemsPerPage)
      .all()
      .then(r => {
        updateAddToBags(r.toArray())
        if (r.hasNextPage()) {
          r.nextPage().then(n => {
            updateAddToBags(r.toArray())
          })
        }
        if (r.hasPrevPage()) {
          r.prevPage().then(p => {
            updateAddToBags(r.toArray())
          })
        }
        document.dispatchEvent(new Event('clayer-add-to-bags-ready'))
      })
  }
}

const selectSku = (
  skuId,
  skuName,
  skuCode,
  skuImageUrl,
  priceContainerId,
  availabilityMessageContainerId,
  addToBagId,
  addToBagQuantityId
) => {
  Sku.includes('prices').perPage(itemsPerPage).find(skuId).then(s => {
    updatePrice(s, priceContainerId)
    updateAvailabilityMessage(s.inventory, availabilityMessageContainerId)
    if (s.inventory.available) {
      updateAddToBagSKU(
        skuId,
        skuName,
        skuCode,
        skuImageUrl,
        addToBagId,
        addToBagQuantityId
      )
      updateAddVariantQuantitySKU(
        skuId,
        skuName,
        skuCode,
        skuImageUrl,
        s.inventory.quantity,
        addToBagQuantityId
      )
      enableAddToBag(addToBagId)
      enableAddVariantQuantity(addToBagQuantityId)
    } else {
      disableAddToBag(addToBagId)
      disableAddVariantQuantity(addToBagQuantityId)
    }
    document.dispatchEvent(new Event('clayer-variant-selected'))
  })
}

const createOrder = async () => {
  const attrs = {
    shippingCountryCodeLock: config.countryCode,
    languageCode: config.languageCode,
    cartUrl: config.cartUrl,
    returnUrl: config.returnUrl,
    privacyUrl: config.privacyUrl,
    termsUrl: config.termsUrl
  }
  return Order.create(attrs).then(o => {
    setOrderToken(o.id)
    return o
  })
}

const getOrder = () => {
  const orderId = getOrderToken()
  return Order.includes('line_items').find(orderId).then(o => {
    updateShoppingBagItems(o)
    updateShoppingBagSummary(o)
    updateShoppingBagCheckout(o)
    if (o.skusCount === 0) {
      clearShoppingBag()
    }
    document.dispatchEvent(new Event('clayer-order-ready'))
    return o
  })
}

const refreshOrder = () => {
  if (getOrderToken()) {
    getOrder().then(order => {
      if (!order || order.status == 'placed') {
        deleteOrderToken()
        clearShoppingBag()
      }
    })
  }
}

// TODO: Refactory
const createLineItem = async (
  orderId,
  skuId,
  skuName,
  skuCode,
  skuImageUrl,
  quantity = 1
) => {
  // FIXME: Check the Sku reference
  const order = Order.build({ id: orderId })
  const lineItemData: any = {
    // skuCode: sku.code,
    order
  }
  if (skuName) lineItemData.name = skuName
  if (skuCode) lineItemData.skuCode = skuCode
  if (skuImageUrl) lineItemData.image_url = skuImageUrl
  if (quantity) lineItemData.quantity = quantity
  debugger

  return LineItem.create(lineItemData)
    .then(lnIt => {
      document.dispatchEvent(new Event('clayer-line-item-created'))
      return lnIt
    })
    .catch(error => error)
}

const updateLineItem = (lineItemId, attributes) => {
  document.dispatchEvent(new Event('clayer-line-item-updated'))
  // FIXME: Write the right type in the sdk
  return LineItem.find(lineItemId).then((lnIt: any) => {
    return lnIt.update(attributes)
  })
}

const deleteLineItem = lineItemId => {
  return LineItem.find(lineItemId).then(lnI => {
    document.dispatchEvent(new Event('clayer-line-item-deleted'))
    return lnI.destroy()
  })
}

const updateShoppingBagItems = order => {
  const shoppingBagItemsContainer = document.querySelector(
    '#clayer-shopping-bag-items-container'
  )
  if (shoppingBagItemsContainer) {
    const lineItems = order.lineItems().toArray()
    if (lineItems) {
      shoppingBagItemsContainer.innerHTML = ''

      for (let i = 0; i < lineItems.length; i++) {
        const lineItem = lineItems[i]
        if (lineItem.itemType == 'skus') {
          const shoppingBagItemTemplate = document.querySelector(
            '#clayer-shopping-bag-item-template'
          )

          if (shoppingBagItemTemplate) {
            const shoppingBagItem = getElementFromTemplate(
              shoppingBagItemTemplate
            )

            // image
            const shoppingBagItemImage = shoppingBagItem.querySelector(
              '.clayer-shopping-bag-item-image'
            )
            if (shoppingBagItemImage) {
              shoppingBagItemImage.src = lineItem.imageUrl
            }

            // name
            const shoppingBagItemName = shoppingBagItem.querySelector(
              '.clayer-shopping-bag-item-name'
            )
            if (shoppingBagItemName) {
              shoppingBagItemName.innerHTML = lineItem.name
            }

            // reference
            const shoppingBagItemReference = shoppingBagItem.querySelector(
              '.clayer-shopping-bag-item-reference'
            )
            if (shoppingBagItemReference) {
              shoppingBagItemReference.innerHTML = lineItem.reference
            }

            // qty
            const shoppingBagItemQtyContainer = shoppingBagItem.querySelector(
              '.clayer-shopping-bag-item-qty-container'
            )
            if (shoppingBagItemQtyContainer) {
              const availabilityMessageContainer = shoppingBagItemQtyContainer.querySelector(
                '.clayer-shopping-bag-item-availability-message-container'
              )

              const qtySelect = document.createElement('select')
              qtySelect.dataset.lineItemId = lineItem.id

              for (let qty = 1; qty <= 50; qty++) {
                const option: HTMLOptionElement = document.createElement(
                  'option'
                )
                option.value = `${qty}`
                option.text = `${qty}`
                if (qty == lineItem.quantity) {
                  option.selected = true
                }
                qtySelect.appendChild(option)
              }

              qtySelect.addEventListener('change', (event: any) => {
                const target = event.target
                updateLineItemQty(
                  target.dataset.lineItemId,
                  target.value,
                  availabilityMessageContainer
                )
              })
              shoppingBagItemQtyContainer.insertBefore(
                qtySelect,
                shoppingBagItemQtyContainer.firstChild
              )
            }

            // unit_amount
            const shoppingBagItemUnitAmount = shoppingBagItem.querySelector(
              '.clayer-shopping-bag-item-unit-amount'
            )
            if (shoppingBagItemUnitAmount) {
              shoppingBagItemUnitAmount.innerHTML = lineItem.formattedUnitAmount
            }

            // total_amount
            const shoppingBagItemTotalAmount = shoppingBagItem.querySelector(
              '.clayer-shopping-bag-item-total-amount'
            )
            if (shoppingBagItemTotalAmount) {
              shoppingBagItemTotalAmount.innerHTML =
                lineItem.formattedTotalAmount
            }

            // remove
            const shoppingBagItemRemove = shoppingBagItem.querySelector(
              '.clayer-shopping-bag-item-remove'
            )
            if (shoppingBagItemRemove) {
              shoppingBagItemRemove.dataset.lineItemId = lineItem.id
              shoppingBagItemRemove.addEventListener('click', event => {
                const target = event.target
                event.preventDefault()
                event.stopPropagation()
                deleteLineItem(target.dataset.lineItemId).then(() => {
                  getOrder()
                })
              })
            }

            shoppingBagItemsContainer.appendChild(shoppingBagItem)
          }
        }
      }
    }
  }
}

const updateLineItemQty = (
  lineItemId,
  quantity,
  availabilityMessageContainer
) => {
  updateLineItem(lineItemId, { quantity: quantity })
    .then(() => {
      getOrder()
    })
    .catch(error => {
      if (error && error.status === 422) {
        if (availabilityMessageContainer) {
          displayUnavailableMessage(availabilityMessageContainer)
        }
      }
    })
}

export default {
  getPrices,

  getVariants,

  getVariantsQuantity,

  getAddToBags,

  selectSku,

  createOrder,

  getOrder,

  refreshOrder,

  createLineItem,

  deleteLineItem,

  updateLineItem,

  updateLineItemQty,

  updateShoppingBagItems
}
