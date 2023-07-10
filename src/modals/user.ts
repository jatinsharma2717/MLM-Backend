import { Schema, model } from "mongoose";
import { User } from "../interfaces/user";
const userSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    referbyuserid: { type: Number },
    referralcode: { type: Number },
    accounttypeside: { type: Number },
    mobilenumber: { type: String, required: true },
    userid: { type: Number, unique: true },
    status: { type: Number, default: 2 },
    createdate: { type: Date, default: Date.now },
    updatedate: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const Users = model<User>("users", userSchema);
