type TOptionAttributes = ['code', 'name', 'reference', 'class']

class VariantOption extends HTMLElement {
  _name: string
  _code: string
  _reference: string
  _class: string
  constructor() {
    super()
    this._name = ''
    this._code = ''
    this._reference = ''
    this._class = ''
  }
  static observedAttributes = ['code', 'name', 'reference']
  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    const key = `_${name as TOptionAttributes[number]}` as const
    this[key] = newValue
  }
  connectedCallback() {
    this._updateRendering()
  }
  disconnectedCallback() {
    window.removeEventListener(
      `cl:sku:${this._code}:loaded`,
      this._updateRendering
    )
  }
  get code() {
    return this._code
  }
  set code(v) {
    this.setAttribute('type', v as string)
  }
  _updateRendering() {
    return
  }
}

customElements.define('cl-variant-option', VariantOption)
