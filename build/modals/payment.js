"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentDetails = void 0;
const mongoose_1 = require("mongoose");
const mongodb_1 = require("mongodb");
const paymentDetailsSchema = new mongoose_1.Schema({
    paymenttype: { type: Number, required: true },
    userid: { type: Number, required: true },
    bankname: { type: String },
    accountnumber: { type: Number },
    ifsccode: { type: String },
    branchname: { type: String },
    filename: { type: String },
    image: { type: Buffer },
    contentType: { type: String },
    fileid: { type: mongodb_1.ObjectId },
    branchcity: { type: String },
    createdate: { type: Date, default: Date.now },
    updatedate: { type: Date, default: Date.now },
}, { versionKey: false });
exports.paymentDetails = (0, mongoose_1.model)("payments", paymentDetailsSchema);
//# sourceMappingURL=payment.js.map