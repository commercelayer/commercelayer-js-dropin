import { SkuCollection } from '@commercelayer/js-sdk/dist';
export interface GenericFunction<T, R> {
    ([...T]: any[]): R;
}
export interface UITypes extends GenericFunction<any[], void> {
    updatePrices(skus: SkuCollection[]): any;
}
