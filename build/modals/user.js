"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    firstname: { type: String, required: true },
    middlename: { type: String },
    lastname: { type: String },
    email: { type: String, required: true, unique: true,
    },
    password: { type: String, required: true },
    userid: { type: Number },
    status: { type: Number, default: 1 },
    createdate: { type: Date, default: Date.now },
    updatedate: { type: Date, default: Date.now },
}, { versionKey: false });
exports.Users = (0, mongoose_1.model)('users', userSchema);
//# sourceMappingURL=user.js.map