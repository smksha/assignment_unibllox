import { apiFetch } from "./client";

export function checkout(discountCode?: string) {
  return apiFetch("/checkout", {
    method: "POST",
    body: JSON.stringify({ discountCode }),
  });
}
