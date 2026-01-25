import { cartService } from "../src/services/cart.service";
import { memoryStore, CartItem } from "../src/store/memory.store";

describe("CartService", () => {
  beforeEach(() => {
    // reset in-memory store before each test
    memoryStore.clearCart();
  });

  const sampleItem: CartItem = {
    id: 1,
    title: "iPhone",
    price: 500,
    quantity: 1,
  };

  test("adds item to empty cart", () => {
    const cart = cartService.addItem(sampleItem);

    expect(cart).toHaveLength(1);
    expect(cart[0]).toEqual(sampleItem);
  });

  test("adds quantity when same item is added again", () => {
    cartService.addItem(sampleItem);
    const cart = cartService.addItem(sampleItem);

    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  test("removes one quantity when removeItem is called", () => {
    cartService.addItem({ ...sampleItem, quantity: 2 });

    const cart = cartService.removeItem(sampleItem.id);

    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(1);
  });

  test("removes item completely when quantity reaches zero", () => {
    cartService.addItem(sampleItem);

    const cart = cartService.removeItem(sampleItem.id);

    expect(cart).toHaveLength(0);
  });

  test("throws error when adding item with invalid quantity", () => {
    const invalidItem: CartItem = {
      ...sampleItem,
      quantity: 0,
    };

    expect(() => {
      cartService.addItem(invalidItem);
    }).toThrow("quantity must be greater than 0");
  });

  test("clears the cart", () => {
    cartService.addItem(sampleItem);

    cartService.clearCart();

    expect(cartService.getCartItems()).toHaveLength(0);
  });
});
