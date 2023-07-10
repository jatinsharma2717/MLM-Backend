"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAccountDetails = void 0;
const mongoose_1 = require("mongoose");
const userDetailsSchema = new mongoose_1.Schema({
    userid: { type: Number },
    location: { type: String },
    createdate: { type: Date, default: Date.now },
    updatedate: { type: Date, default: Date.now },
}, { versionKey: false });
exports.UserAccountDetails = (0, mongoose_1.model)("accountdetails", userDetailsSchema);
//# sourceMappingURL=user-details.js.map