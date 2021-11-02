import api from './api'
import { getOrderToken } from './utils'
import {
  displayUnavailableMessage,
  toggleShoppingBag,
  openShoppingBag,
} from './ui'

export default {
  setupVariants: () => {
    const variantSelects: NodeListOf<HTMLSelectElement> =
      document.querySelectorAll('.clayer-variant-select')
    variantSelects.forEach((variantSelect: HTMLSelectElement) => {
      variantSelect.addEventListener('change', (event: any) => {
        const target = event.target
        let selectedOption = variantSelect.options[target.selectedIndex]
        if (selectedOption) {
          console.log(`target.dataset`, selectedOption.dataset)
          api.selectSku(
            selectedOption.value,
            selectedOption.dataset['skuName'] as string,
            selectedOption.dataset['skuCode'] as string,
            selectedOption.dataset['skuImageUrl'] as string,
            target.dataset.priceContainerId,
            target.dataset.availabilityMessageContainerId,
            target.dataset.addToBagId,
            target.dataset.addToBagQuantityId
          )
        }
      })
    })
    const variantRadios: NodeListOf<HTMLInputElement> | null =
      document.querySelectorAll('.clayer-variant-radio')
    variantRadios.forEach((variantRadio: HTMLInputElement) => {
      variantRadio.addEventListener('click', () => {
        api.selectSku(
          variantRadio.value,
          variantRadio.dataset['skuName'] as string,
          variantRadio.dataset['skuCode'] as string,
          variantRadio.dataset['skuImageUrl'] as string,
          variantRadio.dataset['priceContainerId'] as string,
          variantRadio.dataset['availabilityMessageContainerId'] as string,
          variantRadio.dataset['addToBagId'] as string,
          variantRadio.dataset['addToBagQuantityId'] as string
        )
      })
    })
  },
  setupAddVariantQuantity: () => {
    const addVariantsQuantity: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('.clayer-add-to-bag-quantity')
    addVariantsQuantity.forEach((addVariantQuantity) => {
      addVariantQuantity.addEventListener('change', (event) => {
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
    const addToBags: NodeListOf<HTMLButtonElement> =
      document.querySelectorAll('.clayer-add-to-bag')
    addToBags.forEach((addToBag) => {
      addToBag.addEventListener('click', (event) => {
        event.preventDefault()
        let quantity = 1
        const variantQuantity: any =
          addToBag.dataset['addToBagQuantityId'] &&
          document.querySelector(`#${addToBag.dataset['addToBagQuantityId']}`)
        if (variantQuantity) {
          const val = Number(variantQuantity.value)
          const quantityMax =
            variantQuantity.max !== '' && Number(variantQuantity.max)
          if (quantityMax && val > quantityMax) {
            return
          }
          quantity = val
        }
        let orderPromise = getOrderToken() ? api.getOrder() : api.createOrder()
        orderPromise.then((order) => {
          api
            .createLineItem(
              // @ts-ignore
              order.id,
              addToBag.dataset['skuId'] as string,
              addToBag.dataset['skuName'] as string,
              addToBag.dataset['skuCode'] as string,
              addToBag.dataset['skuImageUrl'] as string,
              quantity
            )
            .then(() => {
              api.getOrder()
              openShoppingBag()
            })
            .catch((error) => {
              if (!error.errors().empty()) {
                const availabilityMessageContainer: HTMLElement | null =
                  document.querySelector(
                    `#${addToBag.dataset['availabilityMessageContainerId']}`
                  )
                if (availabilityMessageContainer) {
                  displayUnavailableMessage(availabilityMessageContainer)
                }
              }
            })
        })
      })
    })
  },

  setupShoppingBagToggles: () => {
    const shoppingBagToggles = document.querySelectorAll(
      '.clayer-shopping-bag-toggle'
    )
    shoppingBagToggles.forEach((shoppingBagToggle) => {
      shoppingBagToggle.addEventListener('click', (event) => {
        event.preventDefault()
        toggleShoppingBag()
      })
    })
  },
}
