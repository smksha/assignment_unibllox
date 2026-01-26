import { checkoutService } from "../src/services/checkout.service";
import { cartService } from "../src/services/cart.service";
import { memoryStore } from "../src/store/memory.store";
import { adminService } from "../src/services/admin.service";

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

  test("applies valid discount code", () => {
    // Generate discount on 3rd order
    for (let i = 0; i < 2; i++) {
      addSampleItemToCart();
      checkoutService.checkout();
    }

    const discountCode = adminService.generateDiscountCode();
    if ("message" in discountCode) {
      throw new Error("Discount was expected but not generated");
    }

    // Use discount code on next order

    addSampleItemToCart();
    const order = checkoutService.checkout(discountCode.code);

    expect(order.discountApplied).toBe(100); // 10% of 1000
    expect(order.totalAmount).toBe(900);
  });

  test("throws error when reusing discount code", () => {
    // Generate discount
    for (let i = 0; i < 2; i++) {
      addSampleItemToCart();
      checkoutService.checkout();
    }

    const discountCode = adminService.generateDiscountCode();
    if ("message" in discountCode) {
      throw new Error("Discount was expected but not generated");
    }

    // First use – SUCCESS
    addSampleItemToCart();
    checkoutService.checkout(discountCode.code);

    // Second use – FAIL
    addSampleItemToCart();
    expect(() => {
      checkoutService.checkout(discountCode.code);
    }).toThrow("Invalid or already used discount code");
  });

  test("clears cart after successful checkout", () => {
    addSampleItemToCart();

    checkoutService.checkout();

    expect(memoryStore.getCart()).toHaveLength(0);
  });
});
