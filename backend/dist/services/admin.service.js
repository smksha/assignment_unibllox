"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = exports.AdminService = void 0;
const memory_store_1 = require("../store/memory.store");
const NTH_ORDER_INTERVAL = Number(process.env.NTH_ORDER_INTERVAL) || 3;
// generates a discount code for every 3rd order
class AdminService {
    // generate discount code method
    generateDiscountCode() {
        const interval = Number(process.env.NTH_ORDER_INTERVAL) || 3;
        //For Discount on First Order Only
        if (interval === 1) {
            // Already generated once => never again
            if (memory_store_1.memoryStore.hasFirstOrderDiscountGenerated()) {
                return { message: "Discount not available" };
            }
            const nextOrderNumber = memory_store_1.memoryStore.getNextOrderNumber();
            // Discount only before first order
            if (nextOrderNumber !== 1) {
                return { message: "Discount not available" };
            }
            const code = {
                code: "WELCOME_DISCOUNT",
                isUsed: false,
                createdAt: new Date(),
            };
            memory_store_1.memoryStore.addDiscountCode(code);
            memory_store_1.memoryStore.markFirstOrderDiscountGenerated();
            return code;
        }
        // Return existing unused discount
        const existing = memory_store_1.memoryStore.getDiscountCodes().find((d) => !d.isUsed);
        if (existing) {
            return existing;
        }
        const nextOrderNumber = memory_store_1.memoryStore.getNextOrderNumber();
        // N > 1
        if (nextOrderNumber % interval !== 0) {
            return {
                message: `Discount available on every ${interval}th order`,
            };
        }
        const code = {
            code: `UNIBLOX_${nextOrderNumber}`,
            isUsed: false,
            createdAt: new Date(),
        };
        memory_store_1.memoryStore.addDiscountCode(code);
        return code;
    }
    // get order stats method
    getStats() {
        const orders = memory_store_1.memoryStore.getOrders();
        const discountCodes = memory_store_1.memoryStore.getDiscountCodes();
        const totalItemsPurchased = orders.reduce((sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
        const totalPurchaseAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalDiscountAmount = orders.reduce((sum, order) => sum + order.discountApplied, 0);
        return {
            totalItemsPurchased,
            totalPurchaseAmount,
            totalDiscountAmount,
            discountCodes,
        };
    }
}
exports.AdminService = AdminService;
exports.adminService = new AdminService();
