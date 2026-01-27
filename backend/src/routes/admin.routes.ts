import { Router, Request, Response } from "express";
import { adminService } from "../services/admin.service";
import { memoryStore } from "../store/memory.store";

const router = Router();

/**
 * POST /admin/discount
 */
router.post("/discount", (_req: Request, res: Response) => {
  const result = adminService.generateDiscountCode();
  res.status(200).json(result);
});

router.get("/order-info", (_req: Request, res: Response) => {
  res.json({
    nextOrderNumber: memoryStore.getNextOrderNumber(),
  });
});

/**
 * GET /admin/stats
 */
router.get("/stats", (_req: Request, res: Response) => {
  const stats = adminService.getStats();
  res.json(stats);
});

export default router;
