import { adminService } from "../src/services/admin.service";
import { checkoutService } from "../src/services/checkout.service";
import { cartService } from "../src/services/cart.service";
import { memoryStore } from "../src/store/memory.store";

describe("AdminService", () => {
  beforeEach(() => {
    memoryStore.clearCart();

    // reset internal state
    // @ts-ignore
    memoryStore["orders"] = [];
    // @ts-ignore
    memoryStore["discountCodes"] = [];
    // @ts-ignore
    memoryStore["orderCount"] = 0;
    // @ts-ignore
    memoryStore["firstOrderDiscountGenerated"] = false;

    delete process.env.NTH_ORDER_INTERVAL;
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
    placeOrder(); // nextOrderNumber = 2 (interval default = 3)

    const result = adminService.generateDiscountCode();

    expect(result).toEqual({
      message: "Discount available on every 3th order",
    });
  });

  test("generates discount on nth order", () => {
    placeOrder();
    placeOrder(); // nextOrderNumber = 3

    const result = adminService.generateDiscountCode();

    expect("code" in result).toBe(true);
    expect(result).toHaveProperty("isUsed", false);
  });

  test("does not generate duplicate discount codes", () => {
    placeOrder();
    placeOrder(); // eligible

    const first = adminService.generateDiscountCode();
    const second = adminService.generateDiscountCode();

    expect(first).toEqual(second);
    expect(memoryStore.getDiscountCodes()).toHaveLength(1);
  });

  test("discount remains valid if not used immediately", () => {
    placeOrder();
    placeOrder(); // eligible

    const discount = adminService.generateDiscountCode();

    placeOrder(); // 3rd order AFTER discount generation

    const stillAvailable = adminService.generateDiscountCode();

    expect(stillAvailable).toEqual(discount);
  });

  test("new discount generated only after previous one is used and next interval reached", () => {
    placeOrder();
    placeOrder(); // eligible

    const discount = adminService.generateDiscountCode();

    if (!("code" in discount)) {
      throw new Error("Expected discount");
    }

    cartService.addItem({
      id: 2,
      title: "MacBook",
      price: 1000,
      quantity: 1,
    });
    checkoutService.checkout(discount.code);

    // reach next interval
    placeOrder();
    placeOrder();

    const newDiscount = adminService.generateDiscountCode();

    expect("code" in newDiscount).toBe(true);
    expect(newDiscount).not.toEqual(discount);
  });

  test("N=1: discount available only before first order", () => {
    process.env.NTH_ORDER_INTERVAL = "1";

    const discount = adminService.generateDiscountCode();
    expect("code" in discount).toBe(true);

    placeOrder();

    const after = adminService.generateDiscountCode();
    expect(after).toEqual({ message: "Discount not available" });
  });

  test("N=1: discount does not recycle even if unused", () => {
    process.env.NTH_ORDER_INTERVAL = "1";

    const discount = adminService.generateDiscountCode();
    expect("code" in discount).toBe(true);

    const next = adminService.generateDiscountCode();
    expect(next).toEqual({ message: "Discount not available" });
  });

  test("returns correct admin stats", () => {
    cartService.addItem({
      id: 1,
      title: "iPhone",
      price: 500,
      quantity: 2,
    });
    checkoutService.checkout();

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
