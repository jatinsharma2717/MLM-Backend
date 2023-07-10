"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveUsers = void 0;
const mongoose_1 = require("mongoose");
const activeUserSchema = new mongoose_1.Schema({
    email: { type: String },
    userid: { type: Number },
    isactive: { type: Number, default: 1 },
    activateddate: { type: Date, default: Date.now },
}, { versionKey: false });
exports.ActiveUsers = (0, mongoose_1.model)("activeusers", activeUserSchema);
//# sourceMappingURL=active-user.js.map