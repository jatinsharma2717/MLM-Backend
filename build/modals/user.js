"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    referbyuserid: { type: Number },
    referralcode: { type: Number },
    accounttypeside: { type: Number },
    mobilenumber: { type: String, required: true },
    userid: { type: Number, unique: true },
    status: { type: Number, default: 2 },
    createdate: { type: Date, default: Date.now },
    updatedate: { type: Date, default: Date.now },
}, { versionKey: false });
exports.Users = (0, mongoose_1.model)("users", userSchema);
//# sourceMappingURL=user.js.map