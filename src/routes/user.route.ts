import * as express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  deleteUser,
  getPaymentHistory,
  getReferredUsers,
  getUserDetails,
  loginUser,
  logoutUser,
  registerUser,
  updateUserDetails,
} from "../controllers/user.controller";
const usersRouter = express.Router();
usersRouter.route("/register").post(registerUser);
usersRouter.route("/login").post(loginUser);
usersRouter.route("/logout").post(logoutUser);
usersRouter.use(authMiddleware);
usersRouter.route("").put(updateUserDetails);
usersRouter.route("/").delete(deleteUser);
usersRouter.route("/").get(getUserDetails);
usersRouter.route("/referred/users").get(getReferredUsers);
usersRouter.route("/payment/history").get(getPaymentHistory);

export default usersRouter;
