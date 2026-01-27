import { Router, Request, Response } from "express";
import { cartService } from "../services/cart.service";

const router = Router();

/**
 * GET /cart
 */
router.get("/", (_req: Request, res: Response) => {
  const cart = cartService.getCartItems();
  res.json(cart);
});

/**
 * POST /cart/add
 */
router.post("/add", (req: Request, res: Response) => {
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
router.post("/remove", (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const updatedCart = cartService.removeItem(id);
    res.status(200).json(updatedCart);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
