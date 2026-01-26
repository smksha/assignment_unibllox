import { apiFetch } from "./client";

export type ApiCartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail: string;
};

export function fetchCart() {
  return apiFetch<ApiCartItem[]>("/cart");
}

export function addToCart(item: ApiCartItem) {
  return apiFetch<ApiCartItem[]>("/cart/add", {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export function removeFromCart(id: number) {
  return apiFetch<ApiCartItem[]>("/cart/remove", {
    method: "POST",
    body: JSON.stringify({ id }),
  });
}
