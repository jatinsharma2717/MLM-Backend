"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIdDecryption = exports.userIdEncryption = void 0;
const CryptoJS = require("crypto-js");
const constant_1 = require("../data/constant");
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