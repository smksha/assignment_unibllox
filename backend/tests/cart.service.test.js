"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cart_service_1 = require("../src/services/cart.service");
const memory_store_1 = require("../src/store/memory.store");
describe("CartService", () => {
    beforeEach(() => {
        // reset in-memory store before each test
        memory_store_1.memoryStore.clearCart();
    });
    const sampleItem = {
        id: 1,
        title: "iPhone",
        price: 500,
        quantity: 1,
    };
    test("adds item to empty cart", () => {
        const cart = cart_service_1.cartService.addItem(sampleItem);
        expect(cart).toHaveLength(1);
        expect(cart[0]).toEqual(sampleItem);
    });
    test("adds quantity when same item is added again", () => {
        cart_service_1.cartService.addItem(sampleItem);
        const cart = cart_service_1.cartService.addItem(sampleItem);
        expect(cart).toHaveLength(1);
        expect(cart[0].quantity).toBe(2);
    });
    test("removes one quantity when removeItem is called", () => {
        cart_service_1.cartService.addItem({ ...sampleItem, quantity: 2 });
        const cart = cart_service_1.cartService.removeItem(sampleItem.id);
        expect(cart).toHaveLength(1);
        expect(cart[0].quantity).toBe(1);
    });
    test("removes item completely when quantity reaches zero", () => {
        cart_service_1.cartService.addItem(sampleItem);
        const cart = cart_service_1.cartService.removeItem(sampleItem.id);
        expect(cart).toHaveLength(0);
    });
    test("throws error when adding item with invalid quantity", () => {
        const invalidItem = {
            ...sampleItem,
            quantity: 0,
        };
        expect(() => {
            cart_service_1.cartService.addItem(invalidItem);
        }).toThrow("quantity must be greater than 0");
    });
    test("clears the cart", () => {
        cart_service_1.cartService.addItem(sampleItem);
        cart_service_1.cartService.clearCart();
        expect(cart_service_1.cartService.getCartItems()).toHaveLength(0);
    });
});
