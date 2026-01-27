"use strict";
// in-memory data store for cart, orders, and discount codes
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryStore = void 0;
class MemoryStore {
    constructor() {
        this.cart = [];
        this.orders = [];
        this.discountCodes = [];
        this.orderCount = 0;
        // discount code methods
        //case for 1st order discount
        this.firstOrderDiscountGenerated = false;
    }
    /* -------- CART -------- */
    getCart() {
        return this.cart;
    }
    setCart(items) {
        this.cart = items;
    }
    clearCart() {
        this.cart = [];
    }
    // order methods
    getOrders() {
        return this.orders;
    }
    addOrder(order) {
        this.orders.push(order);
        this.orderCount += 1;
    }
    getOrderCount() {
        return this.orderCount;
    }
    hasFirstOrderDiscountGenerated() {
        return this.firstOrderDiscountGenerated;
    }
    markFirstOrderDiscountGenerated() {
        this.firstOrderDiscountGenerated = true;
    }
    //for general discount codes
    getDiscountCodes() {
        return this.discountCodes;
    }
    addDiscountCode(code) {
        this.discountCodes.push(code);
    }
    findUnusedDiscount(code) {
        return this.discountCodes.find((d) => d.code === code && !d.isUsed);
    }
    markDiscountAsUsed(code) {
        const discount = this.discountCodes.find((d) => d.code === code);
        if (discount) {
            discount.isUsed = true;
        }
    }
    getNextOrderNumber() {
        return this.orderCount + 1;
    }
}
exports.memoryStore = new MemoryStore();
