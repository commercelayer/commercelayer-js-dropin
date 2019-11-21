// const ui = require('./ui')
// const api = require('./api')
// const utils = require('./utils')
import api from './api'
import { toggleShoppingBag } from 'ui'
import { getOrderToken } from './utils'

export default {
  setupVariants: () => {
    const variantSelects: NodeListOf<
      HTMLSelectElement
    > = document.querySelectorAll('.clayer-variant-select')
    variantSelects.forEach(variantSelect => {
      variantSelect.addEventListener('change', (event: any) => {
        const target = event.target
        let selectedOption = variantSelect.options[target.selectedIndex]
        api.selectSku(
          selectedOption.value,
          selectedOption.dataset.skuName,
          selectedOption.dataset.skuReference,
          selectedOption.dataset.skuImageUrl,
          target.dataset.priceContainerId,
          target.dataset.availabilityMessageContainerId,
          target.dataset.addToBagId,
          target.dataset.addToBagQuantityId
        )
      })
    })
    const variantRadios = document.querySelectorAll('.clayer-variant-radio')
    variantRadios.forEach(variantRadio => {
      variantRadio.addEventListener('click', event => {
        api.selectSku(
          this.value,
          this.dataset.skuName,
          this.dataset.skuReference,
          this.dataset.skuImageUrl,
          this.dataset.priceContainerId,
          this.dataset.availabilityMessageContainerId,
          this.dataset.addToBagId,
          this.dataset.addToBagQuantityId
        )
      })
    })
  },
  setupAddVariantQuantity: () => {
    const addVariantsQuantity: NodeListOf<
      HTMLInputElement
    > = document.querySelectorAll('.clayer-add-to-bag-quantity')
    addVariantsQuantity.forEach(addVariantQuantity => {
      addVariantQuantity.addEventListener('change', event => {
        event.preventDefault()
        const min =
          addVariantQuantity.max !== '' && Number(addVariantQuantity.min)
        const max =
          addVariantQuantity.max !== '' && Number(addVariantQuantity.max)
        const val = Number(addVariantQuantity.value)
        if (max && val > max) {
          addVariantQuantity.value = `${max}`
        } else if (min && val < min) {
          addVariantQuantity.value = `${min}`
        }
      })
    })
  },
  setupAddToBags: () => {
    const addToBags: NodeListOf<HTMLButtonElement> = document.querySelectorAll(
      '.clayer-add-to-bag'
    )
    addToBags.forEach(addToBag => {
      addToBag.addEventListener('click', event => {
        event.preventDefault()
        let quantity = 1
        const variantQuantity: HTMLInputElement = document.querySelector(
          `#${addToBag.dataset.addToBagQuantityId}`
        )
        if (variantQuantity) {
          const val = Number(variantQuantity.value)
          const quantityMax =
            variantQuantity.max !== '' && Number(variantQuantity.max)
          if (quantityMax && val > quantityMax) {
            return false
          }
          quantity = val
        }
        let orderPromise = getOrderToken() ? api.getOrder() : api.createOrder()
        // orderPromise.then(function(order) {
        //   api
        //     .createLineItem(
        //       order.id,
        //       addToBag.dataset.skuId,
        //       addToBag.dataset.skuName,
        //       addToBag.dataset.skuReference,
        //       addToBag.dataset.skuImageUrl,
        //       quantity
        //     )
        //     .then(function(lineItem) {
        //       api.getOrder()
        //       ui.openShoppingBag()
        //     })
        //     .catch(function(error) {
        //       switch (error.status) {
        //         case 422:
        //           let availabilityMessageContainer = document.querySelector(
        //             `#${addToBag.dataset.availabilityMessageContainerId}`
        //           )
        //           if (availabilityMessageContainer) {
        //             ui.displayUnavailableMessage(availabilityMessageContainer)
        //           }
        //           break
        //       }
        //     })
        // })
      })
    })
  },

  setupShoppingBagToggles: () => {
    const shoppingBagToggles = document.querySelectorAll(
      '.clayer-shopping-bag-toggle'
    )
    shoppingBagToggles.forEach(shoppingBagToggle => {
      shoppingBagToggle.addEventListener('click', event => {
        event.preventDefault()
        toggleShoppingBag()
      })
    })
  }
}
