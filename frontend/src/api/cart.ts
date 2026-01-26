import { apiFetch } from "./client";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

export function fetchCart() {
  return apiFetch<CartItem[]>("/cart");
}

export function addToCart(item: CartItem) {
  return apiFetch<CartItem[]>("/cart/add", {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export function removeFromCart(id: number) {
  return apiFetch<CartItem[]>("/cart/remove", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}
