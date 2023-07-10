"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayemntToUser = void 0;
const mongoose_1 = require("mongoose");
const paymentToUser = new mongoose_1.Schema({
    userid: { type: Number, required: true },
    amount: { type: Number, required: true },
}, { versionKey: false });
exports.PayemntToUser = (0, mongoose_1.model)("Admin-Payment", paymentToUser);
//# sourceMappingURL=payment-to-user.js.map