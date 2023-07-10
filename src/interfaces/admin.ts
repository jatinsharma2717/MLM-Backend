import { Document } from "mongoose";

export interface JoinUser extends Document {
  amount: number;
  userid: number;
  senderupiid: string;
  paymentmethod: string;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentToUser extends Document {
  userid: number;
  amount:number;
}
export interface PaymentHistory extends Document {
  userid: number;
  amount:number;
}