"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const usersRouter = express.Router();
usersRouter.route('/register').post(user_controller_1.registerUser);
usersRouter.route('/login').post(user_controller_1.loginUser);
usersRouter.use(auth_middleware_1.authMiddleware);
usersRouter.route('/:email').put(user_controller_1.updateUserDetails);
usersRouter.route('/').delete(user_controller_1.deleteUser);
usersRouter.route('/:email').get(user_controller_1.getUserDetails);
exports.default = usersRouter;
//# sourceMappingURL=user.route.js.map