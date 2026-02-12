import type { Sku as TSku } from '@commercelayer/sdk'

const attributes = ['as', 'attribute'] as const

type TAttributes = (HTMLElementTagNameMap & keyof TSku) | string

export class SkuField extends HTMLElement {
  _as: HTMLElementTagNameMap | string
  _attribute: keyof TSku | string
  constructor() {
    super()
    this._as = ''
    this._attribute = ''
  }
  static observedAttributes = attributes
  attributeChangedCallback(
    name: typeof attributes[number],
    _oldValue: string,
    newValue: string
  ) {
    const key = `_${name}` as const
    this[key] = newValue as TAttributes
  }
  get as() {
    return this._as
  }
  set as(v) {
    this.setAttribute('as', v as string)
  }
  get attribute() {
    return this._attribute
  }
  set attribute(v) {
    this.setAttribute('attribute', v)
  }
}

customElements.define('cl-sku-field', SkuField)
