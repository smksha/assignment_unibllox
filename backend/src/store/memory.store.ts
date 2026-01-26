// in-memory data store for cart, orders, and discount codes

export type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  items: CartItem[];
  totalAmount: number;
  discountApplied: number;
  discountCode?: string;
  createdAt: Date;
};

export type DiscountCode = {
  code: string;
  isUsed: boolean;
  createdAt: Date;
};

class MemoryStore {
  private cart: CartItem[] = [];
  private orders: Order[] = [];
  private discountCodes: DiscountCode[] = [];
  private orderCount = 0;

  /* -------- CART -------- */

  getCart(): CartItem[] {
    return this.cart;
  }

  setCart(items: CartItem[]): void {
    this.cart = items;
  }

  clearCart(): void {
    this.cart = [];
  }

  // order methods

  getOrders(): Order[] {
    return this.orders;
  }

  addOrder(order: Order): void {
    this.orders.push(order);
    this.orderCount += 1;
  }

  getOrderCount(): number {
    return this.orderCount;
  }

  // discount code methods

  //case for 1st order discount
  private firstOrderDiscountGenerated = false;

  hasFirstOrderDiscountGenerated() {
    return this.firstOrderDiscountGenerated;
  }

  markFirstOrderDiscountGenerated() {
    this.firstOrderDiscountGenerated = true;
  }

  //for general discount codes

  getDiscountCodes(): DiscountCode[] {
    return this.discountCodes;
  }

  addDiscountCode(code: DiscountCode): void {
    this.discountCodes.push(code);
  }

  findUnusedDiscount(code: string): DiscountCode | undefined {
    return this.discountCodes.find((d) => d.code === code && !d.isUsed);
  }

  markDiscountAsUsed(code: string): void {
    const discount = this.discountCodes.find((d) => d.code === code);
    if (discount) {
      discount.isUsed = true;
    }
  }
  getNextOrderNumber() {
    return this.orderCount + 1;
  }
}

export const memoryStore = new MemoryStore();
