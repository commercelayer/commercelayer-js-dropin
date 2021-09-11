import { SkuCollection } from '@commercelayer/js-sdk';
export declare const updatePrice: (sku: SkuCollection, priceContainerId: string) => void;
export declare const updatePrices: (skus: SkuCollection[]) => void;
export declare const updateVariants: (skus: SkuCollection[], clear: any) => void;
export declare const updateVariantsQuantity: (skus: SkuCollection[]) => void;
export declare const updateAddVariantQuantitySKU: (skuId: any, skuName: any, skuCode: any, skuImageUrl: any, skuMaxQuantity: any, addToBagQuantityId: any) => void;
export declare const updateAddToBags: (skus: SkuCollection[]) => void;
export declare const updateAvailabilityMessage: (inventory: any, availabilityMessageContainerId: any) => void;
export declare const displayAvailableMessage: (container: any, stockLevel: any) => void;
export declare const updateAddToBagSKU: (skuId: any, skuName: any, skuCode: any, skuImageUrl: any, addToBagId: any, addToBagQuantityId: any) => void;
export declare const enableAddVariantQuantity: (addToBagQuantityId: any) => void;
export declare const disableAddVariantQuantity: (addToBagQuantityId: any) => void;
export declare const enableAddToBag: (addToBagId: any) => void;
export declare const disableAddToBag: (addToBagId: any) => void;
export declare const toggleShoppingBag: () => void;
export declare const displayUnavailableMessage: (container: any) => void;
export declare const updateShoppingBagSummary: (order: any) => void;
export declare const updateShoppingBagCheckout: (order: any) => void;
export declare const clearShoppingBag: () => void;
export declare const openShoppingBag: () => void;
export declare const hideAvailabilityMessages: () => void;
