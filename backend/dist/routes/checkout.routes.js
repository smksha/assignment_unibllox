"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkout_service_1 = require("../services/checkout.service");
const router = (0, express_1.Router)();
/**
 * POST /checkout
 */
router.post("/", (req, res) => {
    try {
        const { discountCode } = req.body;
        const order = checkout_service_1.checkoutService.checkout(discountCode);
        res.status(201).json(order);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
