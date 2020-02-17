import { Collection } from '@commercelayer/js-sdk/'

export interface GenericFunction<T, R> {
  ([...T]): R
}

export interface UITypes extends GenericFunction<Collection[], void> {
  updatePrices(skus: Collection[])
}
