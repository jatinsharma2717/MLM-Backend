import { Schema, model } from "mongoose";
import { ActiveUser } from "../interfaces/user";
const activeUserSchema = new Schema(
  {
    email: { type: String },
    userid: { type: Number },
    isactive: { type: Number, default: 1 },
    activateddate: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const ActiveUsers = model<ActiveUser>("activeusers", activeUserSchema);
