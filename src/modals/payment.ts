import { STATES, Schema, model } from "mongoose";
import { PaymentDetails } from "../interfaces/payment";
import { ObjectId } from "mongodb";
const paymentDetailsSchema = new Schema(
  {
    paymenttype: { type: Number, required: true },
    userid: { type: Number, required: true },
    bankname: { type: String },
    accountnumber: { type: Number },
    ifsccode: { type: String },
    branchname: { type: String },
    filename: { type: String },
    image: { type: Buffer },
    contentType: { type: String },
    fileid: { type: ObjectId },
    branchcity: { type: String },
    createdate: { type: Date, default: Date.now },
    updatedate: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const paymentDetails = model<PaymentDetails>(
  "payments",
  paymentDetailsSchema
);
