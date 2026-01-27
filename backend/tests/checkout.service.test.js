"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkout_service_1 = require("../src/services/checkout.service");
const cart_service_1 = require("../src/services/cart.service");
const memory_store_1 = require("../src/store/memory.store");
const admin_service_1 = require("../src/services/admin.service");
describe("CheckoutService", () => {
    beforeEach(() => {
        // Reset all in-memory state
        memory_store_1.memoryStore.clearCart();
        // @ts-ignore – internal reset for test isolation
        memory_store_1.memoryStore["orders"] = [];
        // @ts-ignore
        memory_store_1.memoryStore["discountCodes"] = [];
        // @ts-ignore
        memory_store_1.memoryStore["orderCount"] = 0;
    });
    const addSampleItemToCart = () => {
        cart_service_1.cartService.addItem({
            id: 1,
            title: "iPhone",
            price: 500,
            quantity: 2,
        });
    };
    test("throws error when checking out with empty cart", () => {
        expect(() => {
            checkout_service_1.checkoutService.checkout();
        }).toThrow("Cart is empty");
    });
    test("successfully checks out without discount", () => {
        addSampleItemToCart();
        const order = checkout_service_1.checkoutService.checkout();
        expect(order.totalAmount).toBe(1000);
        expect(order.discountApplied).toBe(0);
        expect(order.items).toHaveLength(1);
    });
    test("applies valid discount code", () => {
        // Generate discount on 3rd order
        for (let i = 0; i < 2; i++) {
            addSampleItemToCart();
            checkout_service_1.checkoutService.checkout();
        }
        const discountCode = admin_service_1.adminService.generateDiscountCode();
        if ("message" in discountCode) {
            throw new Error("Discount was expected but not generated");
        }
        // Use discount code on next order
        addSampleItemToCart();
        const order = checkout_service_1.checkoutService.checkout(discountCode.code);
        expect(order.discountApplied).toBe(100); // 10% of 1000
        expect(order.totalAmount).toBe(900);
    });
    test("throws error when reusing discount code", () => {
        // Generate discount
        for (let i = 0; i < 2; i++) {
            addSampleItemToCart();
            checkout_service_1.checkoutService.checkout();
        }
        const discountCode = admin_service_1.adminService.generateDiscountCode();
        if ("message" in discountCode) {
            throw new Error("Discount was expected but not generated");
        }
        // First use – SUCCESS
        addSampleItemToCart();
        checkout_service_1.checkoutService.checkout(discountCode.code);
        // Second use – FAIL
        addSampleItemToCart();
        expect(() => {
            checkout_service_1.checkoutService.checkout(discountCode.code);
        }).toThrow("Invalid or already used discount code");
    });
    test("clears cart after successful checkout", () => {
        addSampleItemToCart();
        checkout_service_1.checkoutService.checkout();
        expect(memory_store_1.memoryStore.getCart()).toHaveLength(0);
    });
});
