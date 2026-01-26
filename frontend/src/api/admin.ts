// admin discount API

import { apiFetch } from "./client";

export type DiscountResponse =
  | { code: string; isUsed: boolean; createdAt: string }
  | { message: string };

export function fetchAvailableDiscount() {
  return apiFetch<DiscountResponse>("/admin/discount", {
    method: "POST",
  });
}
