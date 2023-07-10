import { Schema, model } from "mongoose";
import { JoinUser } from "../interfaces/admin";
const joinUserSchema = new Schema(
  {
    userid: { type: Number, required: true },
    amount: { type: Number, required: true },
    senderupiid: { type: String, required: true },
    paymentmethod: { type: String, required: true },
    status: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const JoinUserDetails = model<JoinUser>("JoinUser", joinUserSchema);
