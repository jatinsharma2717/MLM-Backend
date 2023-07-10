import * as CryptoJS from "crypto-js";
import { useridEncryptionKey } from "../data/constant";

export async function userIdEncryption(userid: string) {
  var ciphertext = CryptoJS.AES.encrypt(userid, useridEncryptionKey).toString();
  return ciphertext;
}
export async function userIdDecryption(userid: string) {
  var bytes = CryptoJS.AES.decrypt(userid, useridEncryptionKey);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}
