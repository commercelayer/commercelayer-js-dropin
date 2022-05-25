import type { Page } from '@playwright/test'

type PathRefence = {
  configuration: {
    page: ['miss-params', 'wrong-credentials']
  }
  prices: {
    page: ['single-price', 'prices']
  }
}

type PathPages = {
  [K in keyof PathRefence]: `${K}/${PathRefence[K]['page'][number]}`
}[keyof PathRefence]

type NavigateOptions = {
  referer?: string
  timeout?: number
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit'
}

export default class DropinPage {
  readonly page: Page
  constructor(page: Page) {
    this.page = page
  }
  async navigate(path: PathPages, options?: NavigateOptions) {
    await this.page.goto(
      `http://localhost:8080/specs/html/${path}.html`,
      options
    )
  }
  locator(selector: string) {
    return this.page.locator(selector)
  }
}
