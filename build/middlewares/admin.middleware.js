"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const security_service_1 = require("../services/security.service");
const config = process.env;
const adminMiddleware = async (req, res, next) => {
    const accountid = req.headers.accountid;
    if (!accountid) {
        return res.status(400).send({
            message: "Account id is required",
            statusCode: 400,
        });
    }
    const encrypteduserId = +await (0, security_service_1.userIdDecryption)(accountid.toString());
    ;
    if (encrypteduserId !== 1) {
        return res.status(401).send("Authentication failed");
    }
    try {
        next();
    }
    catch (err) {
        res.status(401).send("Authentication failed. Invalid token");
    }
};
exports.adminMiddleware = adminMiddleware;
//# sourceMappingURL=admin.middleware.js.map