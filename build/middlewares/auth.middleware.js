"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt = require("jsonwebtoken");
const constant_1 = require("../data/constant");
const config = process.env;
const authMiddleware = (req, res, next) => {
    const authToken = req.headers.authorization?.split(' ')[1];
    if (!authToken) {
        return res.status(401).send('Authentication failed. Token not found');
    }
    try {
        const decodedToken = jwt.verify(authToken, constant_1.JWT_SECRET_KEY);
        req.user = decodedToken;
        next();
    }
    catch (err) {
        res.status(401).send('Authentication failed. Invalid token');
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map