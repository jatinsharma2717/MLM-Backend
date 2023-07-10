"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentHistoryUser = void 0;
const mongoose_1 = require("mongoose");
const paymentHistory = new mongoose_1.Schema({
    userid: { type: Number, required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { versionKey: false });
exports.PaymentHistoryUser = (0, mongoose_1.model)("Payment-History", paymentHistory);
//# sourceMappingURL=payment-history.js.map