import { memoryStore, DiscountCode } from "../store/memory.store";

const NTH_ORDER_INTERVAL = Number(process.env.NTH_ORDER_INTERVAL) || 3;
// generates a discount code for every 3rd order

class AdminService {
  // generate discount code method

  generateDiscountCode(): DiscountCode | { message: string } {
    const interval = Number(process.env.NTH_ORDER_INTERVAL) || 2;

    //For Discount on First Order Only
    if (interval === 1) {
      // Already generated once => never again
      if (memoryStore.hasFirstOrderDiscountGenerated()) {
        return { message: "Discount not available" };
      }

      const nextOrderNumber = memoryStore.getNextOrderNumber();

      // Discount only before first order
      if (nextOrderNumber !== 1) {
        return { message: "Discount not available" };
      }

      const code: DiscountCode = {
        code: "WELCOME_DISCOUNT",
        isUsed: false,
        createdAt: new Date(),
      };

      memoryStore.addDiscountCode(code);
      memoryStore.markFirstOrderDiscountGenerated();
      return code;
    }

    // Return existing unused discount
    const existing = memoryStore.getDiscountCodes().find((d) => !d.isUsed);

    if (existing) {
      return existing;
    }

    const nextOrderNumber = memoryStore.getNextOrderNumber();

    // N > 1
    if (nextOrderNumber % interval !== 0) {
      return {
        message: `Discount available on every ${interval}th order`,
      };
    }

    const code: DiscountCode = {
      code: `UNIBLOX_${nextOrderNumber}`,
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
