import {  Response, NextFunction } from "express";
import { userIdDecryption } from "../services/security.service";

const config = process.env;

// Middleware to verify JWT token
export const adminMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const accountid = req.headers.accountid;
  if (!accountid) {
    return res.status(400).send({
      message: "Account id is required",
      statusCode: 400,
    });
  }
  const encrypteduserId = +await userIdDecryption(accountid.toString());
; // Assumes that the Authorization header value is in the format "Bearer <token>
  if (encrypteduserId !==1 ) {
    return res.status(401).send("Authentication failed");
  }
  try {
    next();
  } catch (err) {
    res.status(401).send("Authentication failed. Invalid token");
  }
};