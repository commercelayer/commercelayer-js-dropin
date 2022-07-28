import { Sku } from '@commercelayer/sdk'
import { SkuDetail } from './Sku'

const SelectorAttributes = ['as', 'placeholder', 'class'] as const

type TSelectorType = 'select' | 'radio' | undefined
type TSelectorAttributes = typeof SelectorAttributes

class VariantSelector extends HTMLElement {
  _as: TSelectorType
  _placeholder: string
  _class: string
  constructor() {
    super()
    this._as = undefined
    this._placeholder = ''
    this._class = ''
  }
  static observedAttributes = ['as', 'placeholder', 'class']
  attributeChangedCallback(
    name: string,
    _oldValue: string,
    newValue: string & Exclude<TSelectorType, undefined>
  ) {
    const key = `_${name as TSelectorAttributes[number]}` as const
    this[key] = newValue
  }
  connectedCallback() {
    this._updateRendering()
  }
  disconnectedCallback() {
    window.removeEventListener(`cl:sku:loaded`, this._updateRendering)
  }
  get code() {
    return this._as
  }
  set code(v) {
    this.setAttribute('type', v as string)
  }
  _updateRendering() {
    const child: string[] = []
    const className = this._class
    // this.removeAttribute('class')
    if (this._as === 'select' && this._placeholder) {
      child.push(
        `<option disabled selected value="">${this._placeholder}</option>`
      )
    }
    for (const i in this.children) {
      if (Object.prototype.hasOwnProperty.call(this.children, i)) {
        const e = this.children[i] as VariantOption
        const code = e.getAttribute('code')
        const name = e.getAttribute('name')
        const reference = e.getAttribute('reference')
        const label = e.textContent
        const eClassName = e.getAttribute('class') || ''
        document.addEventListener(`cl:skus:${code}:loaded`, (({
          detail,
        }: CustomEvent<SkuDetail>) => {
          if (code && detail[code]) {
            const sku = detail[code] as Sku
            if (this._as === 'select') {
              child.push(
                `<option code="${
                  sku.code
                }" name="${name}" reference="${reference}" value="${sku.id}">${
                  label || sku.name
                }</option>`
              )
            } else {
              child.push(
                `<div><input class="${eClassName}" id="${
                  sku.code
                }" type="radio" code="${
                  sku.code
                }" name="variant-option" reference="${reference}" value="${
                  sku.id
                }"/><label for="${sku.code}">${label || sku.name}</label></div>`
              )
            }
          }
        }) as EventListener)
      }
    }
    document.addEventListener('cl:skus:loaded', () => {
      if (this._as === 'select') {
        this.innerHTML = `<select name="variant-selector" class="${className}">${child.join(
          ''
        )}</select>`
      } else {
        this.innerHTML = `${child.join('')}`
      }
    })
  }
}

customElements.define('cl-variant-selector', VariantSelector)
