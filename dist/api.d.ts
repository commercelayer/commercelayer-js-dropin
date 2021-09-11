import { OrderCollection } from '@commercelayer/js-sdk';
declare const _default: {
    getPrices: () => void;
    getVariants: () => void;
    getVariantsQuantity: () => any;
    getAddToBags: () => any;
    selectSku: (skuId: any, skuName: any, skuCode: any, skuImageUrl: any, priceContainerId: any, availabilityMessageContainerId: any, addToBagId: any, addToBagQuantityId: any) => void;
    createOrder: () => Promise<OrderCollection>;
    getOrder: () => Promise<void | OrderCollection>;
    refreshOrder: () => void;
    createLineItem: (orderId: any, skuId: any, skuName: any, skuCode: any, skuImageUrl: any, quantity?: number) => Promise<import("@commercelayer/js-sdk").LineItemCollection>;
    deleteLineItem: (lineItemId: any) => Promise<any>;
    updateLineItem: (lineItemId: any, attributes: any) => Promise<any>;
    updateLineItemQty: (lineItemId: any, quantity: any, availabilityMessageContainer: any) => void;
    updateShoppingBagItems: (order: OrderCollection) => void;
};
export default _default;
