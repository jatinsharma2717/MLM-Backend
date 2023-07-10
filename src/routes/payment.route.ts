import * as express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getPaymentDetails,
  getPaymentIncome,
  getQrCodeDetails,
  updatePaymentDetails,
} from "../controllers/payment.controller";
import { userIdDecryption } from "../services/security.service";
const paymentDetailsRouter = express.Router();

paymentDetailsRouter.route("/payment/detail").get(getPaymentDetails);
paymentDetailsRouter.route("/payment/income").get(getPaymentIncome);
paymentDetailsRouter.route("/payment/qr-detail").get(getQrCodeDetails);

const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require("dotenv").config();
const url: string = "mongodb+srv://jatinsharmaaj:123456Jhu@cluster0.nxypk97.mongodb.net/MLM";

paymentDetailsRouter.use(authMiddleware);
const storage = new GridFsStorage({
  url,
  file: async (req: any, file: any) => {
    const accountid = req.headers.accountid;
    const encrypteduserId = await userIdDecryption(accountid.toString());
    //If it is an image, save to photos bucket
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      return {
        bucketName: "UserPaymentQR",
        filename: `${encrypteduserId}_${file.originalname}`,
      };
    } else {
      //Otherwise save to default bucket
      return {
        filename: `${Date.now()}_${file.originalname}`,
      };
    }
  },
});

// Set multer storage engine to the newly created object
const upload = multer({ storage });
paymentDetailsRouter
  .route("/payment")
  .post(upload.single("filename"), updatePaymentDetails);

export default paymentDetailsRouter;
