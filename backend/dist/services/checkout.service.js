"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkoutService = void 0;
const memory_store_1 = require("../store/memory.store");
const DISCOUNT_PERCENT = Number(process.env.DISCOUNT_PERCENT) || 10; // 10% discount
class CheckoutService {
    checkout(discountCode) {
        const cartItems = memory_store_1.memoryStore.getCart();
        if (cartItems.length === 0) {
            throw new Error("Cart is empty");
        }
        const subtotal = this.calculateSubtotal(cartItems);
        let discountApplied = 0;
        let appliedDiscountCode;
        if (discountCode) {
            const discount = memory_store_1.memoryStore.findUnusedDiscount(discountCode);
            if (!discount) {
                throw new Error("Invalid or already used discount code");
            }
            discountApplied = this.calculateDiscount(subtotal);
            appliedDiscountCode = discountCode;
            memory_store_1.memoryStore.markDiscountAsUsed(discountCode);
        }
        const totalAmount = Math.max(subtotal - discountApplied, 0);
        const order = {
            id: memory_store_1.memoryStore.getOrderCount() + 1,
            items: cartItems,
            totalAmount,
            discountApplied,
            discountCode: appliedDiscountCode,
            createdAt: new Date(),
        };
        memory_store_1.memoryStore.addOrder(order);
        memory_store_1.memoryStore.clearCart();
        return order;
    }
    // helper methods
    calculateSubtotal(items) {
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
    calculateDiscount(subtotal) {
        return Number((subtotal * DISCOUNT_PERCENT) / 100);
    }
}
exports.checkoutService = new CheckoutService();
