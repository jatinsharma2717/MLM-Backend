"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const usersRouter = express.Router();
usersRouter.route("/register").post(user_controller_1.registerUser);
usersRouter.route("/login").post(user_controller_1.loginUser);
usersRouter.route("/logout").post(user_controller_1.logoutUser);
usersRouter.use(auth_middleware_1.authMiddleware);
usersRouter.route("").put(user_controller_1.updateUserDetails);
usersRouter.route("/").delete(user_controller_1.deleteUser);
usersRouter.route("/").get(user_controller_1.getUserDetails);
usersRouter.route("/referred/users").get(user_controller_1.getReferredUsers);
usersRouter.route("/payment/history").get(user_controller_1.getPaymentHistory);
exports.default = usersRouter;
//# sourceMappingURL=user.route.js.map