import * as express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { joinUser, getAllUsers, updateUserStatus, getPaymentDetailsForAdmin, getQrCodeDetailsForAdmin, payPaymentToUser, deleteUser, getPaymentIncome, getPaymentHistory } from "../controllers/admin.controller";
import { adminMiddleware } from "../middlewares/admin.middleware";
const adminRouter = express.Router();
adminRouter.use(authMiddleware);
adminRouter.route("/join/user").post(joinUser);
adminRouter.use(adminMiddleware)
adminRouter.route("/user/status").post(updateUserStatus);
adminRouter.route("/users").get(getAllUsers);
adminRouter.route("/user/delete").post(deleteUser);
adminRouter.route("/payment/user").put(payPaymentToUser);
adminRouter.route("/payment/detail/:userid").get(getPaymentDetailsForAdmin);
adminRouter.route("/payment/qr-detail/:userid").get(getQrCodeDetailsForAdmin);
adminRouter.route("/payment/totalincome/:userid").get(getPaymentIncome);
adminRouter.route("/payment/history/:userid").get(getPaymentHistory);

export default adminRouter;
