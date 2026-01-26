import { Router } from "express";
import { cartService } from "../services/cart.service";

const router = Router();

/**
 * GET /cart
 */
router.get("/", (_req, res) => {
  const cart = cartService.getCartItems();
  res.json(cart);
});

/**
 * POST /cart/add
 */
router.post("/add", (req, res) => {
  try {
    const updatedCart = cartService.addItem(req.body);
    res.status(200).json(updatedCart);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /cart/remove
 */
router.post("/remove", (req, res) => {
  try {
    const { id } = req.body;
    const updatedCart = cartService.removeItem(id);
    res.status(200).json(updatedCart);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
