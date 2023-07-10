import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../data/constant";

const config = process.env;

// Middleware to verify JWT token
export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization?.split(" ")[1]; // Assumes that the Authorization header value is in the format "Bearer <token>
  if (!authToken) {
    return res.status(401).send("Authentication failed. Token not found");
  }
  try {
    const decodedToken = jwt.verify(authToken, JWT_SECRET_KEY);
    req.user = decodedToken;
    next();
  } catch (err) {
    res.status(401).send("Authentication failed. Invalid token");
  }
};
