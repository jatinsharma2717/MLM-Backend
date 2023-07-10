"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinUserDetails = void 0;
const mongoose_1 = require("mongoose");
const joinUserSchema = new mongoose_1.Schema({
    userid: { type: Number, required: true },
    amount: { type: Number, required: true },
    senderupiid: { type: String, required: true },
    paymentmethod: { type: String, required: true },
    status: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { versionKey: false });
exports.JoinUserDetails = (0, mongoose_1.model)("JoinUser", joinUserSchema);
//# sourceMappingURL=admin.js.map