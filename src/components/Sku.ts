import type { Sku as TSku } from '@commercelayer/sdk'
import placeholderImages from '#utils/placeholderImages'
import type { SkuField } from './SkuField'
type SkuDetail = {
  [code: string]: TSku
}

class Sku extends HTMLElement {
  _code: string
  constructor() {
    super()
    this._code = ''
  }
  static observedAttributes = ['code']
  attributeChangedCallback(_name: string, _oldValue: string, newValue: string) {
    this._code = newValue
  }
  connectedCallback() {
    this._updateRendering()
  }
  disconnectedCallback() {
    window.removeEventListener(
      `cl:sku:${this.code}:loaded`,
      this._updateRendering
    )
  }
  get code() {
    return this._code
  }
  set code(v) {
    this.setAttribute('code', v)
  }
  _updateRendering() {
    document.addEventListener(`cl:skus:${this.code}:loaded`, (({
      detail,
    }: CustomEvent<SkuDetail>) => {
      if (detail[this._code]) {
        const sku = detail[this._code] as TSku
        for (const i in this.children) {
          if (Object.prototype.hasOwnProperty.call(this.children, i)) {
            const e = this.children[i] as SkuField
            const as = e.as
            const attribute = e.attribute as keyof TSku
            const eAttribute = sku[attribute]
            const eClassName = e.className
            e.removeAttribute('class')
            if (as === 'img') {
              const src = eAttribute ? eAttribute : placeholderImages.sku
              e.innerHTML = `<${as} src="${src}" class="${eClassName}"></${as}>`
            } else {
              e.innerHTML = `<${as} class="${eClassName}">${eAttribute}</${as}>`
            }
          }
        }
      }
    }) as EventListener)
  }
}

customElements.define('cl-sku', Sku)
