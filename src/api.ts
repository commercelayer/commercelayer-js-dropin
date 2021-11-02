// import api from './api' import listeners from './listeners'
import config from './config'
import {
  Sku,
  Order,
  LineItem,
  OrderCollection,
  SkuCollection,
} from '@commercelayer/js-sdk'
import { itemsPerPage } from './helpers'
import { updateShoppingBagSummary, updateShoppingBagCheckout } from './ui'
import {
  setOrderToken,
  getOrderToken,
  deleteOrderToken,
  getElementFromTemplate,
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
  clearShoppingBag,
} from './ui'
import * as _ from 'lodash'
// const clsdk = require('@commercelayer/sdk')

const getPrices = () => {
  const prices: NodeListOf<HTMLElement> =
    document.querySelectorAll('.clayer-price')
  if (prices.length > 0) {
    const skuCodes: SkuCollection[] = []
    prices.forEach((price) => {
      if (price.dataset['skuCode']) {
        skuCodes.push(price.dataset['skuCode'] as any)
      }
    })
    Sku.where({ codeIn: skuCodes.join(',') })
      .includes('prices')
      .perPage(itemsPerPage)
      .all()
      .then(async (r) => {
        updatePrices(r.toArray())
        let nextP: any = r
        if (nextP.hasNextPage()) {
          for (let index = 1; index < nextP.pageCount(); index++) {
            nextP = await nextP.nextPage()
            updatePrices(nextP.toArray())
          }
        }
        document.dispatchEvent(new Event('clayer-prices-ready'))

        if (r.empty()) {
          document.dispatchEvent(new Event('clayer-skus-empty'))
        }
      })
  }
}

const getVariants = () => {
  const variants: NodeListOf<HTMLElement> =
    document.querySelectorAll('.clayer-variant')

  if (variants.length > 0) {
    const skuCodes: SkuCollection[] = []

    variants.forEach((variant) => {
      if (variant.dataset['skuCode']) {
        skuCodes.push(variant.dataset['skuCode'] as any)
      }
    })
    Sku.where({ codeIn: skuCodes.join(',') })
      .perPage(itemsPerPage)
      .all()
      .then((r) => {
        updateVariants(r.toArray(), true)
        if (r.hasNextPage()) {
          r.nextPage().then((n) => {
            updateVariants(n.toArray(), false)
          })
        }
        if (r.hasPrevPage()) {
          r.prevPage().then((p) => {
            updateVariants(p.toArray(), false)
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
    const skuCodes: SkuCollection[] = []

    variantQuantity.forEach((variant) => {
      if (variant.dataset['skuCode']) {
        skuCodes.push(variant.dataset['skuCode'] as any)
      }
    })
    if (skuCodes.length === 0) {
      updateVariantsQuantity(skuCodes)
      return
    }
    Sku.where({ codeIn: skuCodes.join(',') })
      .perPage(itemsPerPage)
      .all()
      .then((r) => {
        updateVariantsQuantity(r.toArray())
        if (r.hasNextPage()) {
          r.nextPage().then(() => {
            updateVariantsQuantity(r.toArray())
          })
        }
        document.dispatchEvent(new Event('clayer-variants-quantity-ready'))
      })
  }
}

const getAddToBags = () => {
  const addToBags: NodeListOf<HTMLElement> =
    document.querySelectorAll('.clayer-add-to-bag')

  if (addToBags.length > 0) {
    const skuCodes: SkuCollection[] = []

    addToBags.forEach((addToBag) => {
      if (addToBag.dataset['skuCode']) {
        skuCodes.push(addToBag.dataset['skuCode'] as any)
      }
    })
    if (skuCodes.length === 0) {
      updateAddToBags(skuCodes)
      return
    }
    Sku.where({ codeIn: skuCodes.join(',') })
      .perPage(itemsPerPage)
      .all()
      .then((r) => {
        updateAddToBags(r.toArray())
        if (r.hasNextPage()) {
          r.nextPage().then(() => {
            updateAddToBags(r.toArray())
          })
        }
        if (r.hasPrevPage()) {
          r.prevPage().then(() => {
            updateAddToBags(r.toArray())
          })
        }
        document.dispatchEvent(new Event('clayer-add-to-bags-ready'))
      })
  }
}

const selectSku = (
  skuId: string,
  skuName: string,
  skuCode: string,
  skuImageUrl: string,
  priceContainerId: string = 'clayer-price',
  availabilityMessageContainerId: string,
  addToBagId: string,
  addToBagQuantityId: string
) => {
  Sku.includes('prices')
    .perPage(itemsPerPage)
    .find(skuId)
    .then((s) => {
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
          `${s.inventory.quantity}`,
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
    termsUrl: config.termsUrl,
  }
  return Order.create(attrs).then((o) => {
    setOrderToken(o.id)
    return o
  })
}

const cleanOrder = () => {
  clearShoppingBag()
  deleteOrderToken()
}

const getOrder = () => {
  const orderId = getOrderToken() || ''
  return Order.includes('line_items')
    .find(orderId)
    .then((o) => {
      // @ts-ignore
      const countItems = o.lineItems().size()
      if (!countItems) {
        clearShoppingBag()
      }
      if (o.status === 'placed') {
        cleanOrder()
        return null
      }
      updateShoppingBagSummary(o)
      updateShoppingBagCheckout(o)
      updateShoppingBagItems(o)
      document.dispatchEvent(new Event('clayer-order-ready'))
      return o
    })
    .catch((e) => {
      if (e.code === 'UNAUTHORIZED') {
        cleanOrder()
      }
    })
}

const refreshOrder = () => {
  if (getOrderToken()) {
    getOrder().then((order) => {
      if (!order || order.status == 'placed') {
        deleteOrderToken()
        clearShoppingBag()
      }
    })
  }
}

const createLineItem = (
  orderId: string,
  _skuId: string,
  skuName: string,
  skuCode: string,
  skuImageUrl: string,
  quantity = 1
) => {
  const order = Order.build({ id: orderId })
  const lineItemData: any = {
    order,
  }
  lineItemData.name = skuName ?? ''
  lineItemData.skuCode = skuCode ?? ''
  lineItemData.image_url = skuImageUrl ?? ''
  lineItemData.quantity = quantity ?? ''
  lineItemData._updateQuantity = 1

  return LineItem.create(lineItemData).then((lnIt) => {
    document.dispatchEvent(new Event('clayer-line-item-created'))
    return lnIt
  })
}

const updateLineItem = (lineItemId: string, attributes: any) => {
  document.dispatchEvent(new Event('clayer-line-item-updated'))
  return LineItem.find(lineItemId).then((lnIt: any) => {
    return lnIt.update(attributes)
  })
}

const deleteLineItem = (lineItemId: string) => {
  return LineItem.find(lineItemId).then((lnI) => {
    document.dispatchEvent(new Event('clayer-line-item-deleted'))
    return lnI.destroy()
  })
}

const updateShoppingBagItems = (order: OrderCollection) => {
  const shoppingBagItemsContainer = document.querySelector(
    '#clayer-shopping-bag-items-container'
  )
  if (shoppingBagItemsContainer) {
    // @ts-ignore
    const lineItems = order.lineItems().toArray()
    if (lineItems) {
      shoppingBagItemsContainer.innerHTML = ''

      for (let i = 0; i < lineItems.length; i++) {
        const lineItem = lineItems[i]
        if (
          lineItem &&
          (lineItem.itemType === 'skus' || lineItem.itemType === 'gift_cards')
        ) {
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
              const inputNumber = shoppingBagItemQtyContainer.querySelector(
                'input[type="number"]'
              )
              const maxQty = shoppingBagItemQtyContainer.dataset['maxQty'] || 50
              const minQty = shoppingBagItemQtyContainer.dataset['minQty'] || 1
              const availabilityMessageContainer =
                shoppingBagItemQtyContainer.querySelector(
                  '.clayer-shopping-bag-item-availability-message-container'
                )
              if (!inputNumber) {
                const qtySelect = document.createElement('select')
                if (lineItem.itemType === 'gift_cards') {
                  qtySelect.disabled = true
                }
                qtySelect.dataset['lineItemId'] = lineItem.id

                for (let qty = Number(minQty); qty <= Number(maxQty); qty++) {
                  const option: HTMLOptionElement =
                    document.createElement('option')
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
              } else {
                inputNumber.dataset.lineItemId = lineItem.id
                inputNumber.value = lineItem.quantity
                inputNumber.min = inputNumber.min || 1
                inputNumber.addEventListener('change', (event: any) => {
                  const target = event.target
                  updateLineItemQty(
                    target.dataset.lineItemId,
                    target.value,
                    availabilityMessageContainer
                  )
                })
              }
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
              shoppingBagItemRemove.addEventListener(
                'click',
                function (event: any) {
                  const target = event.target
                  event.preventDefault()
                  event.stopPropagation()
                  const lineItemId =
                    // @ts-ignore
                    target.dataset['lineItemId'] || this.dataset['lineItemId']
                  deleteLineItem(lineItemId).then(() => {
                    getOrder()
                  })
                }
              )
            }
            shoppingBagItemsContainer.appendChild(shoppingBagItem)
          }
        }
      }
    }
  }
}

const updateLineItemQty = (
  lineItemId: string,
  quantity: number,
  availabilityMessageContainer: HTMLElement
) => {
  updateLineItem(lineItemId, { quantity: quantity }).then((res) => {
    if (!res.errors().empty()) {
      if (availabilityMessageContainer) {
        displayUnavailableMessage(availabilityMessageContainer)
      }
    } else {
      getOrder()
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

  updateShoppingBagItems,
}
