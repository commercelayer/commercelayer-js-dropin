import { selectSku } from './api'
// import { getOrderToken } from './utils'
import {
  // displayUnavailableMessage,
  toggleShoppingBag,
  // openShoppingBag,
} from './ui'
import { ElementType } from './@types/ui'
import { CLSdk } from './utils/get-sdk'

export function handleSelectors<T extends ElementType>(
  sdk: CLSdk,
  elementType: T
) {
  const elements: NodeListOf<HTMLSelectElement> = document.querySelectorAll(
    `.clayer-${elementType}, [data-element-type=${elementType}]`
  )
  const [firstElement] = elements
  if (firstElement?.localName === 'option') {
    const select = firstElement.closest('select')
    select?.addEventListener('change', (event) => {
      const target = event.target as HTMLSelectElement
      const option = select?.options[target?.selectedIndex]
      if (option) {
        const id = option.dataset['skuId'] || option.value
        const name = option.dataset?.['skuName']
        const code = option.dataset?.['skuCode']
        const imageUrl = option.dataset?.['skuImageUrl']
        const reference = option.dataset?.['skuReference']
        const priceContainerId = target.dataset?.['priceContainerId']
        const availabilityContainerId =
          target.dataset?.['availabilityMessageContainerId']
        const addToBagId = target.dataset?.['addToBagId']
        const addToBagQuantityId = target.dataset?.['addToBagQuantityId']
        id &&
          selectSku({
            sdk,
            sku: {
              id,
              name,
              code,
              imageUrl,
              reference,
            },
            price: {
              elementId: priceContainerId,
            },
            availability: {
              elementId: availabilityContainerId,
            },
            addToBagId: {
              elementId: addToBagId,
            },
            quantity: {
              elementId: addToBagQuantityId,
            },
          })
      }
    })
  }
}

export default {
  setupVariants: () => {
    // const variantSelects: NodeListOf<HTMLSelectElement> =
    //   document.querySelectorAll('.clayer-variant-select')
    // variantSelects.forEach((variantSelect: HTMLSelectElement) => {
    //   variantSelect.addEventListener('change', (event: any) => {
    //     const target = event.target
    //     let selectedOption = variantSelect.options[target.selectedIndex]
    //     if (selectedOption) {
    //       const id = selectedOption.dataset['skuId'] || selectedOption.value
    //       api.selectSku(
    //         id,
    //         selectedOption.dataset['skuName'] as string,
    //         selectedOption.dataset['skuCode'] as string,
    //         selectedOption.dataset['skuImageUrl'] as string,
    //         target.dataset.priceContainerId,
    //         target.dataset.availabilityMessageContainerId,
    //         target.dataset.addToBagId,
    //         target.dataset.addToBagQuantityId,
    //         selectedOption.dataset['skuReference'] as string
    //       )
    //     }
    //   })
    // })
    // const variantRadios: NodeListOf<HTMLInputElement> | null =
    //   document.querySelectorAll('.clayer-variant-radio')
    // variantRadios.forEach((variantRadio: HTMLInputElement) => {
    //   variantRadio.addEventListener('click', () => {
    //     const id = variantRadio.dataset['skuId'] || variantRadio.value
    //     api.selectSku(
    //       id,
    //       variantRadio.dataset['skuName'] as string,
    //       variantRadio.dataset['skuCode'] as string,
    //       variantRadio.dataset['skuImageUrl'] as string,
    //       variantRadio.dataset['priceContainerId'] as string,
    //       variantRadio.dataset['availabilityMessageContainerId'] as string,
    //       variantRadio.dataset['addToBagId'] as string,
    //       variantRadio.dataset['addToBagQuantityId'] as string,
    //       variantRadio.dataset['skuReference'] as string
    //     )
    //   })
    // })
  },
  setupAddVariantQuantity: () => {
    const addVariantsQuantity: NodeListOf<HTMLInputElement> =
      document.querySelectorAll(
        '.clayer-add-to-bag-quantity, [data-element-type=add-to-bag-quantity]'
      )
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
      // @ts-ignore
      addToBag.addEventListener('click', (_event: any) => {
        _event.preventDefault()
        const disabled =
          _event?.target?.attributes?.disabled?.value === 'disabled'
        if (disabled) return false
        // let quantity = 1
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
          // quantity = val
        }
        // let orderPromise = getOrderToken() ? api.getOrder() : api.createOrder()
        // return orderPromise.then((order) => {
        //   api
        //     .createLineItem(
        //       // @ts-ignore
        //       order.id,
        //       addToBag.dataset['skuId'] as string,
        //       addToBag.dataset['skuName'] as string,
        //       addToBag.dataset['skuCode'] as string,
        //       addToBag.dataset['skuImageUrl'] as string,
        //       addToBag.dataset['skuReference'] as string,
        //       quantity
        //     )
        //     .then(() => {
        //       api.getOrder()
        //       openShoppingBag()
        //     })
        //     .catch((error) => {
        //       if (!error.errors().empty()) {
        //         const availabilityMessageContainer: HTMLElement | null =
        //           document.querySelector(
        //             `#${addToBag.dataset['availabilityMessageContainerId']}`
        //           )
        //         if (availabilityMessageContainer) {
        //           displayUnavailableMessage(availabilityMessageContainer)
        //         }
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
    shoppingBagToggles.forEach((shoppingBagToggle) => {
      shoppingBagToggle.addEventListener('click', (event) => {
        event.preventDefault()
        toggleShoppingBag()
      })
    })
  },
}
