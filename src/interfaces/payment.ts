export interface PaymentDetails extends Document {
  paymentType: 1 | 2;
  userid: number;
  bankname?: string;
  accountnumber?: number;
  ifsccode?: string;
  branchname?: string;
  branchcity?: string;
  filename?: string;
  image?: any;
  contentType: string;
  fileid: any;
}
