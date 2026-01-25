import { memoryStore, DiscountCode } from "../store/memory.store";

const NTH_ORDER_INTERVAL = 3; // generates a discount code for every 3rd order

class AdminService {
  // generate discount code method

  generateDiscountCode(): DiscountCode | { message: string } {
    //check for existing discount code
    const exostingCodes = memoryStore.getDiscountCodes().find((d) => !d.isUsed);
    if (exostingCodes) {
      return exostingCodes;
    }

    const orderCount = memoryStore.getOrderCount();

    // Condition not satisfied
    if (orderCount === 0 || orderCount % NTH_ORDER_INTERVAL !== 0) {
      return { message: "Discount not available yet" };
    }

    // If an unused discount already exists, return it
    const existing = memoryStore.getDiscountCodes().find((d) => !d.isUsed);

    if (existing) {
      return existing;
    }

    // Generate exactly ONE discount code
    const code: DiscountCode = {
      code: `DISCOUNT_${orderCount}`,
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
