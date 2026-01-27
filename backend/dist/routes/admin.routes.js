"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_service_1 = require("../services/admin.service");
const memory_store_1 = require("../store/memory.store");
const router = (0, express_1.Router)();
/**
 * POST /admin/discount
 */
router.post("/discount", (_req, res) => {
    const result = admin_service_1.adminService.generateDiscountCode();
    res.status(200).json(result);
});
router.get("/order-info", (_req, res) => {
    res.json({
        nextOrderNumber: memory_store_1.memoryStore.getNextOrderNumber(),
    });
});
/**
 * GET /admin/stats
 */
router.get("/stats", (_req, res) => {
    const stats = admin_service_1.adminService.getStats();
    res.json(stats);
});
exports.default = router;
