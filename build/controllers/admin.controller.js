"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentHistory = exports.getPaymentIncome = exports.deleteUser = exports.payPaymentToUser = exports.getQrCodeDetailsForAdmin = exports.getPaymentDetailsForAdmin = exports.updateUserStatus = exports.getAllUsers = exports.joinUser = void 0;
const security_service_1 = require("../services/security.service");
const admin_1 = require("../data/admin");
const admin_2 = require("../modals/admin");
const user_1 = require("../modals/user");
const user_level_1 = require("../modals/user-level");
const payment_1 = require("../modals/payment");
const mongodb_1 = require("mongodb");
const payment_to_user_1 = require("../modals/payment-to-user");
const payment_history_1 = require("../modals/payment-history");
const constant_1 = require("../data/constant");
const user_2 = require("../data/user");
const joinUser = async (req, res) => {
    const accountid = req.headers.accountid;
    if (!accountid) {
        return res.status(400).send({
            message: "Account id is required",
            statusCode: 400,
        });
    }
    const encrypteduserId = await (0, security_service_1.userIdDecryption)(accountid.toString());
    const { amount, senderupiid, paymentmethod, status } = req.body;
    if (!amount) {
        return res.status(400).send({
            message: "amount is required",
            statusCode: 400,
        });
    }
    else if (!senderupiid) {
        return res.status(400).send({
            message: "senderupiid is required",
            statusCode: 400,
        });
    }
    else if (!paymentmethod) {
        return res.status(400).send({
            message: "paymentmethod is required",
            statusCode: 400,
        });
    }
    try {
        const newJoinUser = new admin_2.JoinUserDetails({
            amount: req.body.amount,
            senderupiid: req.body.senderupiid,
            paymentmethod: req.body.paymentmethod,
            status: req.body.status ? req.body.status : 3,
            userid: +encrypteduserId,
        });
        await newJoinUser.save();
        await user_1.Users.findOneAndUpdate({ userid: +encrypteduserId }, {
            $set: {
                status: req.body.status ? req.body.status : 3,
            },
        }, { new: true });
        res.status(200).send(admin_1.joinUserResponse);
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.joinUser = joinUser;
const getAllUsers = async (req, res) => {
    const accountid = req.headers.accountid;
    if (!accountid) {
        return res.status(400).send({
            message: "Account id is required",
            statusCode: 400,
        });
    }
    try {
        const user = await user_1.Users.find();
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
exports.getAllUsers = getAllUsers;
const updateUserStatus = async (req, res) => {
    const userid = req.body.userid;
    const status = req.body.status;
    const referbyuserid = req.body.referid;
    if (!userid) {
        return res.status(400).send({
            message: "userid is required",
            statusCode: 400,
        });
    }
    if (!status) {
        return res.status(400).send({
            message: "status is required",
            statusCode: 400,
        });
    }
    try {
        await user_1.Users.findOneAndUpdate({ userid: +userid }, { $set: { status: req.body.status } }, { new: true, upsert: true });
        if (req.body.status == constant_1.ACCOUNT_STATUS.ACTIVE) {
            await user_level_1.UserLevels.findOneAndUpdate({ userid: +referbyuserid, "level1.userid": userid }, { $set: { "level1.$[elem].status": 1 } }, { new: true, arrayFilters: [{ "elem.userid": userid }] });
            const level1User = await user_1.Users.find({ userid: +referbyuserid });
            if (level1User?.referbyuserid) {
                await user_level_1.UserLevels.findOneAndUpdate({ userid: +level1User?.referbyuserid, "level2.userid": userid }, { $set: { "level2.$[elem].status": 1 } }, { new: true, arrayFilters: [{ "elem.userid": userid }] });
            }
            const level2User = await user_1.Users.find({
                userid: +level1User?.referbyuserid,
            });
            if (level2User?.referbyuserid) {
                await user_level_1.UserLevels.findOneAndUpdate({ userid: +level2User?.referbyuserid, "level3.userid": userid }, { $set: { "level3.$[elem].status": 1 } }, { new: true, arrayFilters: [{ "elem.userid": userid }] });
                if (level2User?.referbyuserid) {
                    const level3User = await user_1.Users.find({
                        userid: +level2User?.referbyuserid,
                    });
                    if (level3User?.referbyuserid) {
                        await user_level_1.UserLevels.findOneAndUpdate({ userid: +level3User?.referbyuserid, "level4.userid": userid }, { $set: { "level4.$[elem].status": 1 } }, { new: true, arrayFilters: [{ "elem.userid": userid }] });
                        const level4User = await user_1.Users.find({
                            userid: +level3User?.referbyuserid,
                        });
                        if (level4User?.referbyuserid) {
                            await user_level_1.UserLevels.findOneAndUpdate({ userid: +level4User?.referbyuserid, "level5.userid": userid }, { $set: { "level5.$[elem].status": 1 } }, { new: true, arrayFilters: [{ "elem.userid": userid }] });
                            const level5User = await user_1.Users.find({
                                userid: +level4User?.referbyuserid,
                            });
                            if (level5User?.referbyuserid) {
                                await user_level_1.UserLevels.findOneAndUpdate({
                                    userid: +level5User?.referbyuserid,
                                    "level6.userid": userid,
                                }, { $set: { "level6.$[elem].status": 1 } }, { new: true, arrayFilters: [{ "elem.userid": userid }] });
                            }
                        }
                    }
                }
            }
        }
        return res.status(200).send({
            message: "User Status updated Successfully",
            statusCode: 200,
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.updateUserStatus = updateUserStatus;
const getPaymentDetailsForAdmin = async (req, res) => {
    try {
        const accountId = req.headers.accountid || "";
        if (!accountId) {
            res.status(400).json({
                message: "Account id is required",
                statusCode: 400,
            });
            return;
        }
        const user = await payment_1.paymentDetails.find({ userid: req.params.userid });
        const responseBody = {
            data: user,
            message: "success",
            statusCode: 200,
        };
        res.status(200).json(responseBody);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getPaymentDetailsForAdmin = getPaymentDetailsForAdmin;
const getQrCodeDetailsForAdmin = async (req, res) => {
    try {
        const accountId = req.headers.accountid || "";
        if (!accountId) {
            res.status(400).json({
                message: "Account id is required",
                statusCode: 400,
            });
            return;
        }
        const fileDetails = await payment_1.paymentDetails.find({
            userid: +req.params.userid,
        });
        if (!fileDetails) {
            res.status(404).json({
                message: "File not found",
                statusCode: 404,
            });
            return;
        }
        const client = new mongodb_1.MongoClient(constant_1.MONGO_URI);
        await client.connect();
        const dbName = "MLM";
        const bucketName = "UserPaymentQR";
        const bucket = new mongodb_1.GridFSBucket(client.db(dbName), { bucketName });
        const fileId = new mongodb_1.ObjectId(fileDetails?._doc.fileid);
        const downloadStream = bucket.openDownloadStream(fileId);
        if (fileDetails?._doc?.contentType && fileDetails?._doc?.filename) {
            res.set("Content-Type", fileDetails?._doc?.contentType);
            res.set("Content-Disposition", `attachment; filename="${fileDetails?._doc?.filename}"`);
        }
        downloadStream.on("data", (chunk) => {
            res.write(chunk);
        });
        downloadStream.on("end", () => {
            res.end();
        });
        downloadStream.on("error", (error) => {
            console.error("Error downloading file:", error);
            res
                .status(500)
                .json({ message: "Error downloading file", statusCode: 500 });
        });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
};
exports.getQrCodeDetailsForAdmin = getQrCodeDetailsForAdmin;
const payPaymentToUser = async (req, res) => {
    const accountid = req.headers.accountid;
    if (!accountid) {
        return res.status(400).send({
            message: "Account id is required",
            statusCode: 400,
        });
    }
    const { amount, userid } = req.body;
    if (!amount) {
        return res.status(400).send({
            message: "amount is required",
            statusCode: 400,
        });
    }
    else if (!userid) {
        return res.status(400).send({
            message: "userid is required",
            statusCode: 400,
        });
    }
    try {
        let user = await payment_to_user_1.PayemntToUser.find({ userid });
        if (!user) {
            user = new payment_to_user_1.PayemntToUser({ userid, amount });
        }
        else {
            user.amount += amount;
        }
        const newPaymentHistory = new payment_history_1.PaymentHistoryUser({
            amount: amount,
            userid: userid,
        });
        await newPaymentHistory.save();
        await user.save();
        res.status(200).send(admin_1.userPaymentResponse);
    }
    catch (err) {
        res.status(500).send(err);
    }
};
exports.payPaymentToUser = payPaymentToUser;
const deleteUser = async (req, res) => {
    const { userid } = req.body;
    if (!userid) {
        return res.status(400).send({
            message: "userid is required",
            statusCode: 400,
        });
    }
    try {
        const userid = req.body.userid;
        await user_1.Users.deleteOne({ userid: userid });
        res.status(200).send(user_2.deleteUserResponse);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.deleteUser = deleteUser;
const getPaymentIncome = async (req, res) => {
    try {
        const accountId = req.headers.accountid || "";
        if (!accountId) {
            res.status(400).json({
                message: "Account id is required",
                statusCode: 400,
            });
            return;
        }
        const existingUserLevel = await user_level_1.UserLevels.find({
            userid: req.params.userid,
        });
        const level1 = existingUserLevel?.level1;
        const level2 = existingUserLevel?.level2;
        const level3 = existingUserLevel?.level3;
        const level4 = existingUserLevel?.level4;
        const level5 = existingUserLevel?.level5;
        const level6 = existingUserLevel?.level6;
        let level1income = 0;
        let level2income = 0;
        let level3income = 0;
        let level4income = 0;
        let level5income = 0;
        let level6income = 0;
        if (level1) {
            const level1accounttypeside1Income = level1.filter((obj) => obj.accounttypeside === 1 && obj.status === 1).length;
            const level1accounttypeside2Income = level1.filter((obj) => obj.accounttypeside === 2 && obj.status === 1).length;
            level1income = Math.min(level1accounttypeside1Income, level1accounttypeside2Income) * 200;
        }
        if (level2) {
            const level2accounttypeside1Income = level2.filter((obj) => obj.accounttypeside === 1 && obj.status === 1).length;
            const level2accounttypeside2Income = level2.filter((obj) => obj.accounttypeside === 2 && obj.status === 1).length;
            level2income = Math.min(level2accounttypeside1Income, level2accounttypeside2Income) * 100;
        }
        if (level3) {
            const level3accounttypeside1Income = level3.filter((obj) => obj.accounttypeside === 1 && obj.status === 1).length;
            const level3accounttypeside2Income = level3.filter((obj) => obj.accounttypeside === 2 && obj.status === 1).length;
            level3income = Math.min(level3accounttypeside1Income, level3accounttypeside2Income) * 200;
        }
        if (level4) {
            const level4accounttypeside1Income = level4.filter((obj) => obj.accounttypeside === 1 && obj.status === 1).length;
            const level4accounttypeside2Income = level4.filter((obj) => obj.accounttypeside === 2 && obj.status === 1).length;
            level4income = Math.min(level4accounttypeside1Income, level4accounttypeside2Income) * 100;
        }
        if (level5) {
            const level5accounttypeside1Income = level5.filter((obj) => obj.accounttypeside === 1 && obj.status === 1).length;
            const level5accounttypeside2Income = level5.filter((obj) => obj.accounttypeside === 2 && obj.status === 1).length;
            level5income = Math.min(level5accounttypeside1Income, level5accounttypeside2Income) * 200;
        }
        if (level6) {
            const level6accounttypeside1Income = level6.filter((obj) => obj.accounttypeside === 1 && obj.status === 1).length;
            const level6accounttypeside2Income = level6.filter((obj) => obj.accounttypeside === 2 && obj.status === 1).length;
            level6income = Math.min(level6accounttypeside1Income, level6accounttypeside2Income) * 100;
        }
        let totalincome = level1income + level2income + level3income + level4income + level5income + level6income;
        if (totalincome >= 6500) {
            totalincome = 6500;
        }
        const responseBody = {
            data: {
                totalincome: totalincome
            },
            message: "success",
            statusCode: 200,
        };
        res.status(200).json(responseBody);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
exports.getPaymentIncome = getPaymentIncome;
const getPaymentHistory = async (req, res) => {
    const accountid = req.headers.accountid;
    if (!accountid) {
        return res.status(400).send({
            message: "Account id is required",
            statusCode: 400,
        });
    }
    try {
        const user = await payment_history_1.PaymentHistoryUser.find({ userid: +req.params.userid });
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
//# sourceMappingURL=admin.controller.js.map