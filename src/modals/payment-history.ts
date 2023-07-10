import { Schema, model } from "mongoose";
import { PaymentHistory } from "../interfaces/admin";
const paymentHistory = new Schema(
  {
    userid: { type: Number, required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const PaymentHistoryUser= model<PaymentHistory>("Payment-History", paymentHistory);
