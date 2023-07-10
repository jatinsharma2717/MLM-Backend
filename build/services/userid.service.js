"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserId = void 0;
const user_1 = require("../modals/user");
const generateUserId = async () => {
    const highestIdUser = await user_1.Users.findOne().sort("-userId");
    console.log(highestIdUser);
    let highestId = highestIdUser ? highestIdUser.userid : 0;
    console.log(highestId);
    return highestId + 1;
};
exports.generateUserId = generateUserId;
//# sourceMappingURL=userid.service.js.map