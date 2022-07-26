type PriceDetail = {
  [code: string]: {
    formattedAmount?: string
    formattedCompareAmount?: string
  }
}

class Price extends HTMLElement {
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
      `cl:price:${this.code}:loaded`,
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
    document.addEventListener(`cl:price:${this.code}:loaded`, (({
      detail,
    }: CustomEvent<PriceDetail>) => {
      if (detail[this._code]) {
        for (const i in this.children) {
          if (Object.prototype.hasOwnProperty.call(this.children, i)) {
            const e = this.children[i]
            if (e?.localName === 'cl-price-amount') {
              e.innerHTML = detail[this._code]?.formattedAmount || ''
            }
            if (e?.localName === 'cl-price-compare-amount') {
              e.innerHTML = detail[this._code]?.formattedCompareAmount || ''
            }
          }
        }
      }
    }) as EventListener)
  }
}

customElements.define('cl-price', Price)
