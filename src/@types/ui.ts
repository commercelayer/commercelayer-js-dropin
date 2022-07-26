import { ShippingMethod, Sku } from '@commercelayer/sdk'

export interface GenericFunction<_T, R> {
  ([...T]): R
}

export interface UITypes extends GenericFunction<any[], void> {
  updatePrices(skus: Sku[]): void
}

export type ElementType = 'variant' | 'add-to-bag-quantity' | 'price'

type Time = {
  hours: number
  days: number
}

type DeliveryLeadTime = {
  max: Time
  min: Time
  shipping_method: ShippingMethod
}

export type Level = Partial<
  { delivery_lead_times: DeliveryLeadTime[] } & Pick<SkuInventory, 'quantity'>
>

export type SkuInventory = Sku['inventory'] & {
  available: boolean
  quantity: number
  levels: Level[]
}
