"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartService = void 0;
const memory_store_1 = require("../store/memory.store");
class CartService {
    // fetch cart items
    getCartItems() {
        return memory_store_1.memoryStore.getCart();
    }
    // add and remove items from cart
    addItem(item) {
        this.validateItem(item);
        const cart = memory_store_1.memoryStore.getCart();
        const existing = cart.find((i) => i.id === item.id);
        let updatedCart;
        if (!existing) {
            updatedCart = [...cart, item];
        }
        else {
            updatedCart = cart.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i);
        }
        memory_store_1.memoryStore.setCart(updatedCart);
        return updatedCart;
    }
    removeItem(productId) {
        if (!productId) {
            throw new Error("Invalid productId");
        }
        const cart = memory_store_1.memoryStore.getCart();
        const updatedCart = cart
            .map((item) => item.id === productId ? { ...item, quantity: item.quantity - 1 } : item)
            .filter((item) => item.quantity > 0);
        memory_store_1.memoryStore.setCart(updatedCart);
        return updatedCart;
    }
    clearCart() {
        memory_store_1.memoryStore.clearCart();
    }
    //validation method
    validateItem(item) {
        if (!item.id) {
            throw new Error("id is required");
        }
        if (item.quantity <= 0) {
            throw new Error("quantity must be greater than 0");
        }
        if (item.price < 0) {
            throw new Error("price must be non-negative");
        }
        if (!item.title || item.title.trim() === "") {
            throw new Error("title is required");
        }
    }
}
exports.cartService = new CartService();
