import { memoryStore, CartItem, Order } from "../store/memory.store";

const NTH_ORDER_INTERVAL = 3; //  generate discount code every 3rd orders
const DISCOUNT_PERCENT = 0.1; // 10% discount

class CheckoutService {
  checkout(discountCode?: string): Order {
    const cartItems = memoryStore.getCart();

    if (cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    const subtotal = this.calculateSubtotal(cartItems);

    let discountApplied = 0;
    let appliedDiscountCode: string | undefined;

    if (discountCode) {
      const discount = memoryStore.findUnusedDiscount(discountCode);

      if (!discount) {
        throw new Error("Invalid or already used discount code");
      }

      discountApplied = this.calculateDiscount(subtotal);
      appliedDiscountCode = discountCode;

      memoryStore.markDiscountAsUsed(discountCode);
    }

    const totalAmount = Math.max(subtotal - discountApplied, 0);

    const order: Order = {
      id: memoryStore.getOrderCount() + 1,
      items: cartItems,
      totalAmount,
      discountApplied,
      discountCode: appliedDiscountCode,
      createdAt: new Date(),
    };

    memoryStore.addOrder(order);
    memoryStore.clearCart();

    this.maybeGenerateDiscountCode();

    return order;
  }

  // helper methods

  private calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private calculateDiscount(subtotal: number): number {
    return Number((subtotal * DISCOUNT_PERCENT).toFixed(2));
  }

  private maybeGenerateDiscountCode(): void {
    const orderCount = memoryStore.getOrderCount();

    if (orderCount % NTH_ORDER_INTERVAL !== 0) {
      return;
    }

    const code = `DISCOUNT_${orderCount}`;

    memoryStore.addDiscountCode({
      code,
      isUsed: false,
      createdAt: new Date(),
    });
  }
}

export const checkoutService = new CheckoutService();
