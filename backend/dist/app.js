"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_routes_1 = __importDefault(require("./routes/cart.routes"));
const checkout_routes_1 = __importDefault(require("./routes/checkout.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
}));
app.use(express_1.default.json());
app.use(express_1.default.json());
app.use("/cart", cart_routes_1.default);
app.use("/checkout", checkout_routes_1.default);
app.use("/admin", admin_routes_1.default);
app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
});
exports.default = app;
