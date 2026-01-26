import { adminService } from "../src/services/admin.service";
import { checkoutService } from "../src/services/checkout.service";
import { cartService } from "../src/services/cart.service";
import { memoryStore } from "../src/store/memory.store";

describe("AdminService", () => {
  beforeEach(() => {
    memoryStore.clearCart();

    // Reset internal state for isolation
    // @ts-ignore
    memoryStore["orders"] = [];
    // @ts-ignore
    memoryStore["discountCodes"] = [];
    // @ts-ignore
    memoryStore["orderCount"] = 0;
  });

  const placeOrder = () => {
    cartService.addItem({
      id: 1,
      title: "iPhone",
      price: 500,
      quantity: 1,
    });

    checkoutService.checkout();
  };

  test("returns message when discount is not yet available", () => {
    placeOrder(); // order 1

    const result = adminService.generateDiscountCode();

    expect(result).toEqual({ message: "Discount not available yet" });
  });

  test("generates discount on nth order", () => {
    placeOrder();
    placeOrder();
    placeOrder(); // 3rd order

    const result = adminService.generateDiscountCode();

    expect("code" in result).toBe(true);
    expect(result).toHaveProperty("isUsed", false);
  });

  test("does not generate duplicate discount codes", () => {
    placeOrder();
    placeOrder();
    placeOrder(); // eligible

    const first = adminService.generateDiscountCode();
    const second = adminService.generateDiscountCode();

    expect(first).toEqual(second);
    expect(memoryStore.getDiscountCodes()).toHaveLength(1);
  });

  test("discount remains valid if not used immediately", () => {
    placeOrder();
    placeOrder();
    placeOrder(); // discount eligible

    const discount = adminService.generateDiscountCode();

    // Place another order WITHOUT using discount
    placeOrder(); // 4th order

    const stillAvailable = adminService.generateDiscountCode();

    expect(stillAvailable).toEqual(discount);
  });

  test("new discount not generated until previous one is used", () => {
    // Reach 3rd order
    placeOrder();
    placeOrder();
    placeOrder();

    const discount = adminService.generateDiscountCode();

    // Use the discount
    cartService.addItem({
      id: 2,
      title: "MacBook",
      price: 1000,
      quantity: 1,
    });

    if ("message" in discount) {
      throw new Error("Discount was expected but not generated");
    }
    checkoutService.checkout(discount.code);

    // Reach next nth order (6)
    placeOrder();
    placeOrder();
    placeOrder();

    const newDiscount = adminService.generateDiscountCode();

    expect(newDiscount).not.toEqual(discount);
  });
  test("N=1: discount is available after first order", () => {
    process.env.NTH_ORDER_INTERVAL = "1";

    cartService.addItem({
      id: 1,
      title: "Item",
      price: 100,
      quantity: 1,
    });
    checkoutService.checkout();

    const result = adminService.generateDiscountCode();
    expect("code" in result).toBe(true);
  });

  test("N=1: discount does not regenerate until previous is used", () => {
    process.env.NTH_ORDER_INTERVAL = "1";

    // first order
    cartService.addItem({ id: 1, title: "Item", price: 100, quantity: 1 });
    checkoutService.checkout();

    const first = adminService.generateDiscountCode();

    // second order without using discount
    cartService.addItem({ id: 2, title: "Item 2", price: 200, quantity: 1 });
    checkoutService.checkout();

    const second = adminService.generateDiscountCode();

    expect(first).toEqual(second);
  });

  test("returns correct admin stats", () => {
    // Order 1
    cartService.addItem({
      id: 1,
      title: "iPhone",
      price: 500,
      quantity: 2,
    });
    checkoutService.checkout();

    // Order 2
    cartService.addItem({
      id: 2,
      title: "iPad",
      price: 300,
      quantity: 1,
    });
    checkoutService.checkout();

    const stats = adminService.getStats();

    expect(stats.totalItemsPurchased).toBe(3);
    expect(stats.totalPurchaseAmount).toBe(1300);
    expect(stats.totalDiscountAmount).toBe(0);
    expect(Array.isArray(stats.discountCodes)).toBe(true);
  });
});
