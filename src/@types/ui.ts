import { SkuCollection } from '@commercelayer/js-sdk/dist'

export interface GenericFunction<_T, R> {
  ([...T]): R
}

export interface UITypes extends GenericFunction<any[], void> {
  updatePrices(skus: SkuCollection[]): void
}
