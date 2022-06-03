import { getSalesChannelToken } from '@commercelayer/js-auth'
import { getPrices, getSkus } from '#api'
import { getAccessTokenCookie, setAccessTokenCookie } from './utils'
import getSdk from './utils/get-sdk.js'
import './components'

type Args = {
  clientId: string
  endpoint: string
  scope: string
  returnUrl?: string
  privacyUrl?: string
  termsUrl?: string
  cartUrl?: string
}

export async function init({ clientId, endpoint, scope, ...options }: Args) {
  if (![clientId, endpoint, scope].every(Boolean)) {
    const msg = `clientId, endpoint, and scope are required to init Commerce Layer.`
    window.alert(msg)
    throw new Error(msg)
  }
  console.log('options', options)
  let auth: any = {}
  if (!getAccessTokenCookie()) {
    try {
      auth = await getSalesChannelToken({
        clientId,
        endpoint,
        scope,
      })
      setAccessTokenCookie(auth.accessToken, auth.expires)
    } catch (error: any) {
      window.alert(error.message)
      throw new Error(error.message)
    }
  } else {
    auth.accessToken = getAccessTokenCookie()
  }
  const sdk = getSdk({
    accessToken: auth.accessToken,
    endpoint,
  })
  customElements.whenDefined('cl-sku').then(() => {
    getSkus(sdk)
  })
  customElements.whenDefined('cl-price').then(() => {
    getPrices(sdk)
  })
  // getVariants(sdk, 'variant')
  // getVariants(sdk, 'add-to-bag-quantity')
  // api.getAddToBags()

  // handleSelectors(sdk, 'variant')
  // // listeners.setupVariants()
  // listeners.setupAddVariantQuantity()
  // listeners.setupAddToBags()
  // listeners.setupShoppingBagToggles()

  // api.refreshOrder()
}

// window.commercelayer = {
//   init,
// } as any
