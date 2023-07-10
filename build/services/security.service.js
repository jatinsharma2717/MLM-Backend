"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdDecryption = exports.userIdEncryption = exports.verifyPassword = exports.hashPassword = void 0;
const bcrypt = require("bcrypt");
const CryptoJS = require("crypto-js");
const constant_1 = require("../data/constant");
async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}
exports.hashPassword = hashPassword;
async function verifyPassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}
exports.verifyPassword = verifyPassword;
async function userIdEncryption(userid) {
    var ciphertext = CryptoJS.AES.encrypt(userid, constant_1.useridEncryptionKey).toString();
    return ciphertext;
}
exports.userIdEncryption = userIdEncryption;
async function userIdDecryption(userid) {
    var bytes = CryptoJS.AES.decrypt(userid, constant_1.useridEncryptionKey);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}
exports.userIdDecryption = userIdDecryption;
//# sourceMappingURL=security.service.js.map