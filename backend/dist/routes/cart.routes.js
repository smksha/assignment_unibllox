"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_service_1 = require("../services/cart.service");
const router = (0, express_1.Router)();
/**
 * GET /cart
 */
router.get("/", (_req, res) => {
    const cart = cart_service_1.cartService.getCartItems();
    res.json(cart);
});
/**
 * POST /cart/add
 */
router.post("/add", (req, res) => {
    try {
        const updatedCart = cart_service_1.cartService.addItem(req.body);
        res.status(200).json(updatedCart);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
/**
 * POST /cart/remove
 */
router.post("/remove", (req, res) => {
    try {
        const { id } = req.body;
        const updatedCart = cart_service_1.cartService.removeItem(id);
        res.status(200).json(updatedCart);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.default = router;
