type TSelectorType = 'select' | 'radio' | undefined

class VariantSelector extends HTMLElement {
  _type: TSelectorType
  constructor() {
    super()
    this._type = undefined
  }
  static observedAttributes = ['type']
  attributeChangedCallback(
    _name: string,
    _oldValue: string,
    newValue: TSelectorType
  ) {
    this._type = newValue
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
    return this._type
  }
  set code(v) {
    this.setAttribute('type', v as string)
  }
  _updateRendering() {
    // document.addEventListener(`cl:skus:${this.code}:loaded`, (({
    //   detail,
    // }: CustomEvent<SkuDetail>) => {
    //   if (detail[this._type]) {
    //     const sku = detail[this._type] as TSku
    //     for (const i in this.children) {
    //       if (Object.prototype.hasOwnProperty.call(this.children, i)) {
    //         const e = this.children[i] as SkuField
    //         const as = e.as
    //         const attribute = e.attribute as keyof TSku
    //         const eAttribute = sku[attribute]
    //         const eClassName = e.className
    //         e.removeAttribute('class')
    //         if (as === 'img') {
    //           const src = eAttribute ? eAttribute : placeholderImages.sku
    //           e.innerHTML = `<${as} src="${src}" class="${eClassName}"></${as}>`
    //         } else {
    //           e.innerHTML = `<${as} class="${eClassName}">${eAttribute}</${as}>`
    //         }
    //       }
    //     }
    //   }
    // }) as EventListener)
  }
}

customElements.define('cl-variant-selector', VariantSelector)
