import { Router } from "express";
import { checkoutService } from "../services/checkout.service";

const router = Router();

/**
 * POST /checkout
 */
router.post("/", (req, res) => {
  try {
    const { discountCode } = req.body;
    const order = checkoutService.checkout(discountCode);
    res.status(201).json(order);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
