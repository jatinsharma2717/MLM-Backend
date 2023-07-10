import { Schema, model } from "mongoose";
import { UserDetails } from "../interfaces/user";
const userDetailsSchema = new Schema(
  {
    userid: { type: Number },
    location: { type: String },
    createdate: { type: Date, default: Date.now },
    updatedate: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const UserAccountDetails = model<UserDetails>(
  "accountdetails",
  userDetailsSchema
);
