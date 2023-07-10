import { Document } from "mongoose";

export interface User extends Document {
  firstname: string;
  lastname: string;
  password: string;
  userid: number;
  confirmpassword: string;
  email: string;
  referralcode: number;
  mobilenumber: string;
  referbyuserid: number;
  accounttypeside: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}
export interface ActiveUser extends Document {
  email: string;
  isactive: number;
  usercount: number;
  userid: number;
}
export interface UserDetails extends Document {
  location: string;
  userid: number;
}
export interface UserLevel extends Document {
  userid: number;
  referbyuserid: number;
  level1: [];
  level2: [];
  level3: [];
  level4: [];
  level5: [];
  level6: [];
}

