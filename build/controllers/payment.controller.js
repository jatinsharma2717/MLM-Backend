"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentIncome = exports.getQrCodeDetails = exports.getPaymentDetails = exports.updatePaymentDetails = void 0;
const payment_1 = require("../modals/payment");
const security_service_1 = require("../services/security.service");
const payment_2 = require("../data/payment");
const mongodb_1 = require("mongodb");
const user_level_1 = require("../modals/user-level");
const constant_1 = require("../data/constant");
const updatePaymentDetails = async (req, res) => {
    const accountid = req.headers.accountid;
    const encrypteduserId = await (0, security_service_1.userIdDecryption)(accountid.toString());
    if (!accountid) {
        return res.status(400).send({
            message: "Account id is required",
            statusCode: 400,
        });
    }
    if (req.file) {
        const file = req.file;
        const fileData = await payment_1.paymentDetails.findOneAndUpdate({ userid: encrypteduserId }, {
            $set: {
                paymenttype: constant_1.PAYMENT_STATUS.BANK_ACCOUNT,
                userid: file.userid,
                filename: file.filename,
                image: req.file.buffer,
                contentType: req.file.mimetype,
                fileid: req.file.id,
            },
        }, { new: true, upsert: true });
        return res.status(200).send({
            message: "Image Uploaded",
            statusCode: 200,
        });
    }
    const paymentType = req.body.paymenttype;
    if (!paymentType) {
        return res.status(400).send({
            message: "Payment Type is required",
            statusCode: 400,
        });
    }
    if (+paymentType != constant_1.PAYMENT_STATUS.BANK_ACCOUNT && +paymentType != constant_1.PAYMENT_STATUS.QRCODE) {
        return res.status(400).send({
            message: "Payment Type should be 1 or 2",
            statusCode: 400,
        });
    }
    try {
        if (paymentType == constant_1.PAYMENT_STATUS.BANK_ACCOUNT) {
            await payment_1.paymentDetails.findOneAndUpdate({ userid: encrypteduserId }, {
                $set: {
                    paymenttype: req.body.paymenttype,
                    userid: +encrypteduserId,
                    bankname: req.body.bankname,
                    accountnumber: req.body.accountnumber,
                    ifsccode: req.body.ifsccode,
                    branchname: req.body.branchname,
                    branchcity: req.body.branchcity,
                },
            }, { new: true, upsert: true });
        }
        const response = {
            data: payment_2.paymentDetailsResponse,
            message: "success",
            statusCode: 200,
        };
        res.status(200).send(response);
    }
    catch (error) {
        res.status(500).send(error);
    }
};
exports.updatePaymentDetails = updatePaymentDetails;
const getPaymentDetails = async (req, res) => {
    try {
        const accountId = req.headers.accountid || "";
        if (!accountId) {
            res.status(400).json({
                message: "Account id is required",
                statusCode: 400,
            });
            return;
        }
        const encryptedUserId = await (0, security_service_1.userIdDecryption)(accountId.toString());
        const user = await payment_1.paymentDetails.find({ userid: encryptedUserId });
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
exports.getPaymentDetails = getPaymentDetails;
const getQrCodeDetails = async (req, res) => {
    try {
        const accountId = req.headers.accountid || "";
        if (!accountId) {
            res.status(400).json({
                message: "Account id is required",
                statusCode: 400,
            });
            return;
        }
        const encryptedUserId = await (0, security_service_1.userIdDecryption)(accountId.toString());
        const fileDetails = await payment_1.paymentDetails.find({
            userid: +encryptedUserId,
        });
        if (fileDetails) {
            const client = new mongodb_1.MongoClient(constant_1.MONGO_URI);
            await client.connect();
            const dbName = "MLM";
            const bucketName = "UserPaymentQR";
            const bucket = new mongodb_1.GridFSBucket(client.db(dbName), { bucketName });
            const fileId = new mongodb_1.ObjectId(fileDetails?._doc?.fileid);
            const downloadStream = bucket.openDownloadStream(fileId);
            res.set("Content-Type", fileDetails?._doc?.contentType);
            res.set("Content-Disposition", `attachment; filename="${fileDetails?._doc?.filename}"`);
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
        else {
            res.status(200).json({ message: "You do not have any file", statusCode: 200 });
        }
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
};
exports.getQrCodeDetails = getQrCodeDetails;
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
        const encrypteduserId = await (0, security_service_1.userIdDecryption)(accountId.toString());
        const existingUserLevel = await user_level_1.UserLevels.find({
            userid: encrypteduserId,
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
//# sourceMappingURL=payment.controller.js.map