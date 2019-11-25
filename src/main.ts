// import api from './api' import listeners from './listeners' const config =
// require('./config')
import { salesChannel } from '@commercelayer/js-auth'
import { initCLayer } from '@commercelayer/js-sdk'
import api from './api'
import config from './config'
import listeners from './listeners'

const init = async () => {
  const auth = await salesChannel({
    clientId: config.clientId,
    endpoint: config.baseUrl,
    scopes: `market:${config.marketId}`
  })
  initCLayer({
    accessToken: auth.accessToken,
    host: config.baseUrl.replace('https://', '')
  })
  api.getPrices()
  api.getVariants()
  api.getVariantsQuantity()
  api.getAddToBags()

  listeners.setupVariants()
  listeners.setupAddVariantQuantity()
  listeners.setupAddToBags()
  listeners.setupShoppingBagToggles()

  api.refreshOrder()
}

function initCommercelayer() {
  // const api = require('./api') const listeners = require('./listeners') const
  // config = require('./config') const clsdk = require('@commercelayer/sdk')
  window.commercelayer = {
    init
  }
  init()
}

if (document.readyState == 'loading') {
  document.addEventListener('readystatechange', () => {
    if (document.readyState == 'interactive') {
      initCommercelayer()
    }
  })
} else {
  // interactive or complete
  initCommercelayer()
}
