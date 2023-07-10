import { Schema, model } from "mongoose";
import { PaymentToUser } from "../interfaces/admin";
const paymentToUser = new Schema(
  {
    userid: { type: Number, required: true },
    amount: { type: Number, required: true },
  },
  { versionKey: false }
);

export const PayemntToUser = model<PaymentToUser>("Admin-Payment", paymentToUser);
