"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const payment_controller_1 = require("../controllers/payment.controller");
const security_service_1 = require("../services/security.service");
const paymentDetailsRouter = express.Router();
paymentDetailsRouter.route("/payment/detail").get(payment_controller_1.getPaymentDetails);
paymentDetailsRouter.route("/payment/income").get(payment_controller_1.getPaymentIncome);
paymentDetailsRouter.route("/payment/qr-detail").get(payment_controller_1.getQrCodeDetails);
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require("dotenv").config();
const url = "mongodb+srv://jatinsharmaaj:123456Jhu@cluster0.nxypk97.mongodb.net/MLM";
paymentDetailsRouter.use(auth_middleware_1.authMiddleware);
const storage = new GridFsStorage({
    url,
    file: async (req, file) => {
        const accountid = req.headers.accountid;
        const encrypteduserId = await (0, security_service_1.userIdDecryption)(accountid.toString());
        if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
            return {
                bucketName: "UserPaymentQR",
                filename: `${encrypteduserId}_${file.originalname}`,
            };
        }
        else {
            return {
                filename: `${Date.now()}_${file.originalname}`,
            };
        }
    },
});
const upload = multer({ storage });
paymentDetailsRouter
    .route("/payment")
    .post(upload.single("filename"), payment_controller_1.updatePaymentDetails);
exports.default = paymentDetailsRouter;
//# sourceMappingURL=payment.route.js.map