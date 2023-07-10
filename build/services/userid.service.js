"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserId = void 0;
const user_1 = require("../modals/user");
const generateUserId = async () => {
    try {
        const highestIdUser = await user_1.Users.findOne().sort({ userid: -1 });
        let highestId = highestIdUser ? highestIdUser.userid : 0;
        return highestId + 1;
    }
    catch (error) {
        console.error("Error generating user ID:", error);
        throw error;
    }
};
exports.generateUserId = generateUserId;
//# sourceMappingURL=userid.service.js.map