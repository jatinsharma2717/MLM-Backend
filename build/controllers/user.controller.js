"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDetails = exports.updateUserDetails = exports.deleteUser = exports.loginUser = exports.registerUser = void 0;
const security_service_1 = require("../services/security.service");
const user_1 = require("../data/user");
const user_2 = require("../modals/user");
const userid_service_1 = require("../services/userid.service");
const active_user_1 = require("../modals/active-user");
const jwt = require("jsonwebtoken");
const constant_1 = require("../data/constant");
const registerUser = async (req, res) => {
    if (req.body.password !== req.body.confirmpassword) {
        return res.status(400).send({
            message: "Password and confirm password do not match",
            statusCode: 400,
        });
    }
    const hashedPassword = await (0, security_service_1.hashPassword)(req.body.password);
    const userid = await (0, userid_service_1.generateUserId)();
    const newUser = new user_2.Users({
        firstname: req.body.firstname,
        middlename: req.body.middlename,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
        userid: userid
    });
    try {
        const existingUser = await user_2.Users.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send({
                message: "Email already exists",
                statusCode: 400,
            });
        }
        await newUser.save();
        const recieverDetails = {
            name: newUser.firstname,
            email: newUser.email
        };
        res.status(200).send(user_1.registerUserResponse);
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).send({
                message: "Email is required",
                statusCode: 400,
            });
        }
        if (!password) {
            return res.status(400).send({
                message: "Password is required",
                statusCode: 400,
            });
        }
        const existingUser = await user_2.Users.findOne({ email });
        if (!existingUser) {
            return res.status(400).send({
                message: "Invalid credentials",
                statusCode: 400,
            });
        }
        const passwordMatches = await (0, security_service_1.verifyPassword)(password, existingUser.password);
        if (!passwordMatches) {
            return res.status(400).send({
                message: "Invalid credentials",
                statusCode: 400,
            });
        }
        const newActiveUser = new active_user_1.ActiveUsers({
            email: req.body.email,
            userid: existingUser.userid
        });
        await newActiveUser.save();
        const token = jwt.sign({ userid: existingUser.userid, email: email }, constant_1.JWT_SECRET_KEY, { expiresIn: '1h' });
        const encrypteduserId = await (0, security_service_1.userIdEncryption)(existingUser.userid.toString());
        res.status(200).send({
            message: "Login successful",
            statusCode: 200,
            data: {
                accountid: encrypteduserId,
                bearertoken: token
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({
            message: "Internal server error",
            statusCode: 500,
        });
    }
};
exports.loginUser = loginUser;
const deleteUser = async (req, res) => {
    try {
        const email = req.body.email;
        await user_2.Users.deleteOne({ email: email });
        res.status(200).send(user_1.deleteUserResponse);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.deleteUser = deleteUser;
const updateUserDetails = async (req, res) => {
    try {
        const email = req.params.email;
        const userDetail = await user_2.Users.findByIdAndUpdate({ email: email }, {
            $set: {
                firstname: req.body.firstname,
                middlename: req.body.middlename,
                lastname: req.body.lastname,
                password: req.body.password,
            },
        }, { new: true });
        const response = {
            data: userDetail,
            message: "success",
            statusCode: 200,
        };
        res.status(200).send(response);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.updateUserDetails = updateUserDetails;
const getUserDetails = async (req, res) => {
    try {
        const user = await user_2.Users.findById({ email: req.params.email });
        const responseBody = {
            data: user,
            message: "success",
            statusCode: 200
        };
        res.status(200).send(responseBody);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getUserDetails = getUserDetails;
//# sourceMappingURL=user.controller.js.map