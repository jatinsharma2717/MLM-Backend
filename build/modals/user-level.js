"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLevels = void 0;
const mongoose_1 = require("mongoose");
const LevelSchema = new mongoose_1.Schema({
    userid: { type: Number, required: true },
    referbyuserid: { type: Number, default: 0 },
    level1: { type: Array },
    level2: { type: Array },
    level3: { type: Array },
    level4: { type: Array },
    level5: { type: Array },
    level6: { type: Array },
}, { versionKey: false });
exports.UserLevels = (0, mongoose_1.model)("user-levels", LevelSchema);
//# sourceMappingURL=user-level.js.map