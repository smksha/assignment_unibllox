import { memoryStore, DiscountCode } from "../store/memory.store";

const NTH_ORDER_INTERVAL = Number(process.env.NTH_ORDER_INTERVAL) || 3;
// generates a discount code for every 3rd order

class AdminService {
  // generate discount code method
  generateDiscountCode(): DiscountCode | { message: string } {
    // 1Return existing unused discount
    const existing = memoryStore.getDiscountCodes().find((d) => !d.isUsed);

    if (existing) {
      return existing;
    }

    const interval = Number(process.env.NTH_ORDER_INTERVAL) || 2;
    const nextOrderNumber = memoryStore.getNextOrderNumber();

    //  N = 1 → first order of each cycle
    if (interval === 1) {
      const code: DiscountCode = {
        code: `DISCOUNT_${nextOrderNumber}`,
        isUsed: false,
        createdAt: new Date(),
      };

      memoryStore.addDiscountCode(code);
      return code;
    }

    // N > 1
    if (nextOrderNumber % interval !== 0) {
      return {
        message: `Discount available on every ${interval}th order`,
      };
    }

    const code: DiscountCode = {
      code: `DISCOUNT_${nextOrderNumber}`,
      isUsed: false,
      createdAt: new Date(),
    };

    memoryStore.addDiscountCode(code);
    return code;
  }

  // get order stats method

  getStats() {
    const orders = memoryStore.getOrders();
    const discountCodes = memoryStore.getDiscountCodes();

    const totalItemsPurchased = orders.reduce(
      (sum, order) =>
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0,
    );

    const totalPurchaseAmount = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );

    const totalDiscountAmount = orders.reduce(
      (sum, order) => sum + order.discountApplied,
      0,
    );

    return {
      totalItemsPurchased,
      totalPurchaseAmount,
      totalDiscountAmount,
      discountCodes,
    };
  }
}

export const adminService = new AdminService();
