import { memoryStore, CartItem } from "../store/memory.store";

class CartService {
  // fetch cart items

  getCartItems(): CartItem[] {
    return memoryStore.getCart();
  }

  // add and remove items from cart

  addItem(item: CartItem): CartItem[] {
    this.validateItem(item);

    const cart = memoryStore.getCart();
    const existing = cart.find((i) => i.id === item.id);

    let updatedCart: CartItem[];

    if (!existing) {
      updatedCart = [...cart, item];
    } else {
      updatedCart = cart.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i,
      );
    }

    memoryStore.setCart(updatedCart);
    return updatedCart;
  }

  removeItem(productId: number): CartItem[] {
    if (!productId) {
      throw new Error("Invalid productId");
    }

    const cart = memoryStore.getCart();

    const updatedCart = cart
      .map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
      )
      .filter((item) => item.quantity > 0);

    memoryStore.setCart(updatedCart);
    return updatedCart;
  }

  clearCart(): void {
    memoryStore.clearCart();
  }

  //validation method

  private validateItem(item: CartItem) {
    if (!item.id) {
      throw new Error("id is required");
    }

    if (item.quantity <= 0) {
      throw new Error("quantity must be greater than 0");
    }

    if (item.price < 0) {
      throw new Error("price must be non-negative");
    }

    if (!item.title || item.title.trim() === "") {
      throw new Error("title is required");
    }
  }
}

export const cartService = new CartService();
