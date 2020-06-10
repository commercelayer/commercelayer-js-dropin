/// <reference types="cypress" />

import {
  SetRoutes,
  NewStubData,
  SaveRequests,
} from '@commercelayer/cypress-vcr'

declare namespace Cypress {
  interface Chainable {
    setRoutes: SetRoutes
    newStubData: NewStubData
    saveRequests: SaveRequests
  }
}
