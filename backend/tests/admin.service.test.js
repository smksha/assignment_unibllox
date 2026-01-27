"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_service_1 = require("../src/services/admin.service");
const checkout_service_1 = require("../src/services/checkout.service");
const cart_service_1 = require("../src/services/cart.service");
const memory_store_1 = require("../src/store/memory.store");
describe("AdminService", () => {
    beforeEach(() => {
        memory_store_1.memoryStore.clearCart();
        // reset internal state
        // @ts-ignore
        memory_store_1.memoryStore["orders"] = [];
        // @ts-ignore
        memory_store_1.memoryStore["discountCodes"] = [];
        // @ts-ignore
        memory_store_1.memoryStore["orderCount"] = 0;
        // @ts-ignore
        memory_store_1.memoryStore["firstOrderDiscountGenerated"] = false;
        delete process.env.NTH_ORDER_INTERVAL;
    });
    const placeOrder = () => {
        cart_service_1.cartService.addItem({
            id: 1,
            title: "iPhone",
            price: 500,
            quantity: 1,
        });
        checkout_service_1.checkoutService.checkout();
    };
    test("returns message when discount is not yet available", () => {
        placeOrder(); // nextOrderNumber = 2 (interval default = 3)
        const result = admin_service_1.adminService.generateDiscountCode();
        expect(result).toEqual({
            message: "Discount available on every 3th order",
        });
    });
    test("generates discount on nth order", () => {
        placeOrder();
        placeOrder(); // nextOrderNumber = 3
        const result = admin_service_1.adminService.generateDiscountCode();
        expect("code" in result).toBe(true);
        expect(result).toHaveProperty("isUsed", false);
    });
    test("does not generate duplicate discount codes", () => {
        placeOrder();
        placeOrder(); // eligible
        const first = admin_service_1.adminService.generateDiscountCode();
        const second = admin_service_1.adminService.generateDiscountCode();
        expect(first).toEqual(second);
        expect(memory_store_1.memoryStore.getDiscountCodes()).toHaveLength(1);
    });
    test("discount remains valid if not used immediately", () => {
        placeOrder();
        placeOrder(); // eligible
        const discount = admin_service_1.adminService.generateDiscountCode();
        placeOrder(); // 3rd order AFTER discount generation
        const stillAvailable = admin_service_1.adminService.generateDiscountCode();
        expect(stillAvailable).toEqual(discount);
    });
    test("new discount generated only after previous one is used and next interval reached", () => {
        placeOrder();
        placeOrder(); // eligible
        const discount = admin_service_1.adminService.generateDiscountCode();
        if (!("code" in discount)) {
            throw new Error("Expected discount");
        }
        cart_service_1.cartService.addItem({
            id: 2,
            title: "MacBook",
            price: 1000,
            quantity: 1,
        });
        checkout_service_1.checkoutService.checkout(discount.code);
        // reach next interval
        placeOrder();
        placeOrder();
        const newDiscount = admin_service_1.adminService.generateDiscountCode();
        expect("code" in newDiscount).toBe(true);
        expect(newDiscount).not.toEqual(discount);
    });
    test("N=1: discount available only before first order", () => {
        process.env.NTH_ORDER_INTERVAL = "1";
        const discount = admin_service_1.adminService.generateDiscountCode();
        expect("code" in discount).toBe(true);
        placeOrder();
        const after = admin_service_1.adminService.generateDiscountCode();
        expect(after).toEqual({ message: "Discount not available" });
    });
    test("N=1: discount does not recycle even if unused", () => {
        process.env.NTH_ORDER_INTERVAL = "1";
        const discount = admin_service_1.adminService.generateDiscountCode();
        expect("code" in discount).toBe(true);
        const next = admin_service_1.adminService.generateDiscountCode();
        expect(next).toEqual({ message: "Discount not available" });
    });
    test("returns correct admin stats", () => {
        cart_service_1.cartService.addItem({
            id: 1,
            title: "iPhone",
            price: 500,
            quantity: 2,
        });
        checkout_service_1.checkoutService.checkout();
        cart_service_1.cartService.addItem({
            id: 2,
            title: "iPad",
            price: 300,
            quantity: 1,
        });
        checkout_service_1.checkoutService.checkout();
        const stats = admin_service_1.adminService.getStats();
        expect(stats.totalItemsPurchased).toBe(3);
        expect(stats.totalPurchaseAmount).toBe(1300);
        expect(stats.totalDiscountAmount).toBe(0);
        expect(Array.isArray(stats.discountCodes)).toBe(true);
    });
});
