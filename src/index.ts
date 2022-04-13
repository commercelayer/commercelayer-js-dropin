import { getSalesChannelToken } from '@commercelayer/js-auth'
import api from './api'
import config from './config'
import listeners from './listeners'
import { getAccessTokenCookie, setAccessTokenCookie } from './utils'
import getSdk from './utils/get-sdk.js'

const init = async () => {
  let auth: any = {}
  if (!getAccessTokenCookie()) {
    auth = await getSalesChannelToken({
      clientId: config.clientId,
      endpoint: config.baseUrl,
      scope: `market:${config.marketId}`,
    })
    setAccessTokenCookie(auth.accessToken, auth.expires)
  } else {
    auth.accessToken = getAccessTokenCookie()
  }
  const sdk = getSdk({
    accessToken: auth.accessToken,
    endpoint: config.baseUrl,
  })
  api.getPrices(sdk)
  api.getVariants(sdk)
  api.getVariantsQuantity()
  api.getAddToBags()

  listeners.setupVariants()
  listeners.setupAddVariantQuantity()
  listeners.setupAddToBags()
  listeners.setupShoppingBagToggles()

  api.refreshOrder()
}

async function initCommercelayer() {
  // const api = require('./api') const listeners = require('./listeners') const
  // config = require('./config') const clsdk = require('@commercelayer/sdk')
  window.commercelayer = {
    init,
  }
  await init()
}

if (document.readyState === 'loading') {
  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'interactive') {
      initCommercelayer()
    }
  })
} else {
  // interactive or complete
  initCommercelayer()
}
