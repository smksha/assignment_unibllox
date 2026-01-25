import { checkoutService } from "../src/services/checkout.service";
import { cartService } from "../src/services/cart.service";
import { memoryStore } from "../src/store/memory.store";

describe("CheckoutService", () => {
  beforeEach(() => {
    // Reset all in-memory state
    memoryStore.clearCart();

    // @ts-ignore – internal reset for test isolation
    memoryStore["orders"] = [];

    // @ts-ignore
    memoryStore["discountCodes"] = [];

    // @ts-ignore
    memoryStore["orderCount"] = 0;
  });

  const addSampleItemToCart = () => {
    cartService.addItem({
      id: 1,
      title: "iPhone",
      price: 500,
      quantity: 2,
    });
  };

  test("throws error when checking out with empty cart", () => {
    expect(() => {
      checkoutService.checkout();
    }).toThrow("Cart is empty");
  });

  test("successfully checks out without discount", () => {
    addSampleItemToCart();

    const order = checkoutService.checkout();

    expect(order.totalAmount).toBe(1000);
    expect(order.discountApplied).toBe(0);
    expect(order.items).toHaveLength(1);
  });

  test("generates discount code on nth order", () => {
    // NTH_ORDER_INTERVAL = 3
    for (let i = 0; i < 3; i++) {
      addSampleItemToCart();
      checkoutService.checkout();
    }

    const discounts = memoryStore.getDiscountCodes();
    expect(discounts).toHaveLength(1);
    expect(discounts[0].isUsed).toBe(false);
  });

  test("applies valid discount code", () => {
    // Generate discount on 3rd order
    for (let i = 0; i < 3; i++) {
      addSampleItemToCart();
      checkoutService.checkout();
    }

    const discountCode = memoryStore.getDiscountCodes()[0].code;

    addSampleItemToCart();
    const order = checkoutService.checkout(discountCode);

    expect(order.discountApplied).toBe(100); // 10% of 1000
    expect(order.totalAmount).toBe(900);
  });

  test("throws error when reusing discount code", () => {
    // Generate discount
    for (let i = 0; i < 3; i++) {
      addSampleItemToCart();
      checkoutService.checkout();
    }

    const discountCode = memoryStore.getDiscountCodes()[0].code;

    // First use – SUCCESS
    addSampleItemToCart();
    checkoutService.checkout(discountCode);

    // Second use – FAIL
    addSampleItemToCart();
    expect(() => {
      checkoutService.checkout(discountCode);
    }).toThrow("Invalid or already used discount code");
  });

  test("clears cart after successful checkout", () => {
    addSampleItemToCart();

    checkoutService.checkout();

    expect(memoryStore.getCart()).toHaveLength(0);
  });
});
