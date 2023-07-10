"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tasks = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    tasktitle: { type: String, required: true },
    note: { type: String },
    duedate: { type: Date, required: true },
    remindtime: { type: String, required: true },
    status: { type: Number, default: 1 },
    createdat: { type: Date, default: Date.now },
    updatedat: { type: Date, default: Date.now },
}, { versionKey: false });
exports.Tasks = (0, mongoose_1.model)('Tasks', taskSchema);
//# sourceMappingURL=tasks.js.map