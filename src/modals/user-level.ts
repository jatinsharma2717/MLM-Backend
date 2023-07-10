import { Schema, model } from "mongoose";
import { UserLevel } from "../interfaces/user";
const LevelSchema: Schema = new Schema({
  userid: { type: Number, required: true },
  referbyuserid: { type: Number, default: 0 },
  level1: { type: Array },
  level2: { type: Array },
  level3: { type: Array },
  level4: { type: Array },
  level5: { type: Array },
  level6: { type: Array },
},
{ versionKey: false });


export const UserLevels = model<UserLevel>("user-levels", LevelSchema);
