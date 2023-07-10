"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentHistory = exports.getReferredUsers = exports.logoutUser = exports.getUserDetails = exports.updateUserDetails = exports.deleteUser = exports.loginUser = exports.registerUser = void 0;
const security_service_1 = require("../services/security.service");
const user_1 = require("../data/user");
const user_2 = require("../modals/user");
const user_details_1 = require("../modals/user-details");
const userid_service_1 = require("../services/userid.service");
const active_user_1 = require("../modals/active-user");
const jwt = require("jsonwebtoken");
const constant_1 = require("../data/constant");
const user_level_1 = require("../modals/user-level");
const payment_history_1 = require("../modals/payment-history");
const registerUser = async (req, res) => {
    const { email, password, firstname, lastname, confirmpassword, mobilenumber, } = req.body;
    if (!email) {
        return res.status(400).send({
            message: "Email is required",
            statusCode: 400,
        });
    }
    else if (!password) {
        return res.status(400).send({
            message: "Password is required",
            statusCode: 400,
        });
    }
    else if (!firstname) {
        return res.status(400).send({
            message: "firstname is required",
            statusCode: 400,
        });
    }
    else if (!lastname) {
        return res.status(400).send({
            message: "lastname is required",
            statusCode: 400,
        });
    }
    else if (!mobilenumber) {
        return res.status(400).send({
            message: "mobilenumber is required",
            statusCode: 400,
        });
    }
    else if (!confirmpassword) {
        return res.status(400).send({
            message: "confirmpassword is required",
            statusCode: 400,
        });
    }
    if (req.body.password !== req.body.confirmpassword) {
        return res.status(400).send({
            message: "Password and confirm password do not match",
            statusCode: 400,
        });
    }
    try {
        const referDetails = req.body?.referralcode;
        const userid = await (0, userid_service_1.generateUserId)();
        let side = 3;
        let referbyuserid = 0;
        if (referDetails) {
            side = +referDetails.substr(referDetails.length - 1);
            referbyuserid =
                (+referDetails.substring(0, referDetails.length - 1) - 99) / 10;
            const newUser = new user_2.Users({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                mobilenumber: req.body.mobilenumber,
                referbyuserid: +referbyuserid,
                referralcode: 10 * userid + 99,
                accounttypeside: +side,
                password: req.body.password,
                userid: userid,
            });
            await user_level_1.UserLevels.findOneAndUpdate({ userid: +referbyuserid }, { $addToSet: { level1: {
                        userid: userid,
                        accounttypeside: +side,
                        status: 2
                    } } }, { new: true, upsert: true });
            const level1User = await user_2.Users.findOne({ userid: +referbyuserid });
            if (level1User?.referbyuserid) {
                await user_level_1.UserLevels.findOneAndUpdate({ userid: +level1User?.referbyuserid }, { $addToSet: { level2: {
                            userid: userid,
                            accounttypeside: +side,
                            status: 2
                        } } }, { new: true, upsert: true });
            }
            const level2User = await user_2.Users.findOne({
                userid: +level1User?.referbyuserid,
            });
            if (level2User?.referbyuserid) {
                await user_level_1.UserLevels.findOneAndUpdate({ userid: +level2User?.referbyuserid }, { $addToSet: { level3: {
                            userid: userid,
                            accounttypeside: +side,
                            status: 2
                        } } }, { new: true, upsert: true });
                if (level2User?.referbyuserid) {
                    const level3User = await user_2.Users.findOne({
                        userid: +level2User?.referbyuserid,
                    });
                    if (level3User?.referbyuserid) {
                        await user_level_1.UserLevels.findOneAndUpdate({ userid: +level3User?.referbyuserid }, { $addToSet: { level4: {
                                    userid: userid,
                                    accounttypeside: +side,
                                    status: 2
                                } } }, { new: true, upsert: true });
                        const level4User = await user_2.Users.findOne({
                            userid: +level3User?.referbyuserid,
                        });
                        if (level4User?.referbyuserid) {
                            await user_level_1.UserLevels.findOneAndUpdate({ userid: +level4User?.referbyuserid }, { $addToSet: { level5: {
                                        userid: userid,
                                        accounttypeside: +side,
                                        status: 2
                                    } } }, { new: true, upsert: true });
                            const level5User = await user_2.Users.findOne({
                                userid: +level4User?.referbyuserid,
                            });
                            if (level5User?.referbyuserid) {
                                await user_level_1.UserLevels.findOneAndUpdate({ userid: +level5User?.referbyuserid }, { $addToSet: { level6: {
                                            userid: userid,
                                            accounttypeside: +side,
                                            status: 2
                                        } } }, { new: true, upsert: true });
                            }
                        }
                    }
                }
            }
            await user_level_1.UserLevels.findOneAndUpdate({ userid: userid }, {
                $set: {
                    referbyuserid: +referbyuserid,
                    level1: [],
                    level2: [],
                    level3: [],
                    level4: [],
                    level5: [],
                    level6: [],
                },
            }, { new: true, upsert: true });
            await newUser.save();
        }
        else {
            const userid = await (0, userid_service_1.generateUserId)();
            const newUser = new user_2.Users({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                mobilenumber: req.body.mobilenumber,
                referbyuserid: +referbyuserid,
                referralcode: 10 * userid + 99,
                accounttypeside: +side,
                password: req.body.password,
                userid: userid,
            });
            await newUser.save();
            await user_level_1.UserLevels.findOneAndUpdate({ userid: userid }, {
                $set: {
                    referbyuserid: +referbyuserid,
                    level1: [],
                    level2: [],
                    level3: [],
                    level4: [],
                    level5: [],
                    level6: [],
                },
            }, { new: true, upsert: true });
        }
        const registerResponse = { ...user_1.registerUserResponse, userid };
        res.status(200).send(registerResponse);
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { userid, password } = req.body;
        if (!userid) {
            return res.status(400).send({
                message: "userid is required",
                statusCode: 400,
            });
        }
        if (!password) {
            return res.status(400).send({
                message: "Password is required",
                statusCode: 400,
            });
        }
        const existingUser = await user_2.Users.findOne({ userid });
        if (!existingUser) {
            return res.status(400).send({
                message: "Invalid credentials",
                statusCode: 400,
            });
        }
        if (!(password == existingUser.password)) {
            return res.status(400).send({
                message: "Invalid credentials",
                statusCode: 400,
            });
        }
        const newActiveUser = new active_user_1.ActiveUsers({
            userid: existingUser.userid,
        });
        await newActiveUser.save();
        const token = jwt.sign({ userid: existingUser.userid }, constant_1.JWT_SECRET_KEY, {
            expiresIn: "24hr",
        });
        const encrypteduserId = await (0, security_service_1.userIdEncryption)(existingUser.userid.toString());
        res.status(200).send({
            message: "Login successful",
            statusCode: 200,
            data: {
                accountid: encrypteduserId,
                bearertoken: token,
                status: existingUser.status,
                referralcode: existingUser.referralcode,
            },
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
    const { email } = req.body;
    if (!email) {
        return res.status(400).send({
            message: "Email is required",
            statusCode: 400,
        });
    }
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
    const accountid = req.headers.accountid;
    if (!accountid) {
        return res.status(400).send({
            message: "Account id is required",
            statusCode: 400,
        });
    }
    const encrypteduserId = await (0, security_service_1.userIdDecryption)(accountid.toString());
    try {
        let userDetail;
        if (req.body.password) {
            userDetail = await user_2.Users.findOneAndUpdate({ userid: +encrypteduserId }, {
                $set: {
                    password: req.body.password,
                },
            }, { new: true });
        }
        else {
            userDetail = await user_2.Users.findOneAndUpdate({ userid: +encrypteduserId }, {
                $set: {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    mobilenumber: req.body.mobilenumber,
                },
            }, { new: true });
        }
        if (req.body.location) {
            await user_details_1.UserAccountDetails.findOneAndUpdate({ userid: userDetail?.userid }, {
                $set: {
                    location: req.body.location,
                },
            }, { new: true, upsert: true });
        }
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
    const accountid = req.headers.accountid;
    if (!accountid) {
        return res.status(400).send({
            message: "Account id is required",
            statusCode: 400,
        });
    }
    const encrypteduserId = await (0, security_service_1.userIdDecryption)(accountid.toString());
    try {
        const user = await user_2.Users.findOne({ userid: +encrypteduserId });
        const responseBody = {
            data: user,
            message: "success",
            statusCode: 200,
        };
        res.status(200).send(responseBody);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getUserDetails = getUserDetails;
const logoutUser = async (req, res) => {
    const accountid = req.headers.accountid;
    if (!accountid) {
        return res.status(400).send({
            message: "Account id is required",
            statusCode: 400,
        });
    }
    const encrypteduserId = await (0, security_service_1.userIdDecryption)(accountid.toString());
    try {
        await active_user_1.ActiveUsers.deleteMany({ userid: +encrypteduserId });
        res.status(200).send(user_1.logoutUserResponse);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.logoutUser = logoutUser;
const getReferredUsers = async (req, res) => {
    const accountid = req.headers.accountid;
    if (!accountid) {
        return res.status(400).send({
            message: "Account id is required",
            statusCode: 400,
        });
    }
    const encrypteduserId = await (0, security_service_1.userIdDecryption)(accountid.toString());
    try {
        const user = await user_level_1.UserLevels.find({ userid: encrypteduserId });
        const responseBody = {
            data: user ? user[0] : {},
            message: "success",
            statusCode: 200,
        };
        res.status(200).send(responseBody);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getReferredUsers = getReferredUsers;
const getPaymentHistory = async (req, res) => {
    const accountid = req.headers.accountid;
    if (!accountid) {
        return res.status(400).send({
            message: "Account id is required",
            statusCode: 400,
        });
    }
    const encrypteduserId = await (0, security_service_1.userIdDecryption)(accountid.toString());
    try {
        const user = await payment_history_1.PaymentHistoryUser.find({ userid: +encrypteduserId });
        const responseBody = {
            data: user,
            message: "success",
            statusCode: 200,
        };
        res.status(200).send(responseBody);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.getPaymentHistory = getPaymentHistory;
//# sourceMappingURL=user.controller.js.map