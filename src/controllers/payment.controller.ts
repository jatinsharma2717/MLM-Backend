import { Request, Response } from "express";
import { paymentDetails } from "../modals/payment";
import { userIdDecryption } from "../services/security.service";
import { paymentDetailsResponse } from "../data/payment";
import mongodb, { MongoClient, ObjectId, GridFSBucket } from "mongodb";
import { UserLevels } from "../modals/user-level";
import {  MONGO_URI, PAYMENT_STATUS } from "../data/constant";



export const updatePaymentDetails = async (req: any, res: Response) => {
  const accountid = req.headers.accountid;
  const encrypteduserId = await userIdDecryption(accountid.toString());

  if (!accountid) {
    return res.status(400).send({
      message: "Account id is required",
      statusCode: 400,
    });
  }
  if (req.file) {
    const file = req.file;
    // Respond with the file details
    const fileData = await paymentDetails.findOneAndUpdate(
      { userid: encrypteduserId },
      {
        $set: {
          paymenttype: PAYMENT_STATUS.BANK_ACCOUNT,
          userid: file.userid,
          filename: file.filename,
          image: req.file.buffer,
          contentType: req.file.mimetype,
          fileid: req.file.id,
        },
      },
      { new: true, upsert: true }
    );
    return res.status(200).send({
      message: "Image Uploaded",
      statusCode: 200,
    });
  }

  const paymentType = req.body.paymenttype;

  if (!paymentType) {
    return res.status(400).send({
      message: "Payment Type is required",
      statusCode: 400,
    });
  }
  if (+paymentType != PAYMENT_STATUS.BANK_ACCOUNT && +paymentType != PAYMENT_STATUS.QRCODE) {
    return res.status(400).send({
      message: "Payment Type should be 1 or 2",
      statusCode: 400,
    });
  }
  try {
    if (paymentType == PAYMENT_STATUS.BANK_ACCOUNT) {
      await paymentDetails.findOneAndUpdate(
        { userid: encrypteduserId },
        {
          $set: {
            paymenttype: req.body.paymenttype,
            userid: +encrypteduserId,
            bankname: req.body.bankname,
            accountnumber: req.body.accountnumber,
            ifsccode: req.body.ifsccode,
            branchname: req.body.branchname,
            branchcity: req.body.branchcity,
          },
        },
        { new: true, upsert: true }
      );
    }
    const response = {
      data: paymentDetailsResponse,
      message: "success",
      statusCode: 200,
    };
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getPaymentDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const accountId = req.headers.accountid || "";
    if (!accountId) {
      res.status(400).json({
        message: "Account id is required",
        statusCode: 400,
      });
      return;
    }

    const encryptedUserId = await userIdDecryption(accountId.toString());
    const user = await paymentDetails.find({ userid: encryptedUserId });

    const responseBody = {
      data: user.length ? user[0] : [],
      message: "success",
      statusCode: 200,
    };

    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getQrCodeDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const accountId = req.headers.accountid || "";
    if (!accountId) {
      res.status(400).json({
        message: "Account id is required",
        statusCode: 400,
      });
      return;
    }

    const encryptedUserId = await userIdDecryption(accountId.toString());
    const fileDbDetails: any = await paymentDetails.find({
      userid: +encryptedUserId,
    });
    const fileDetails= fileDbDetails.length ? fileDbDetails[0] : [];
    if(fileDetails){
 // Create a new MongoDB client and establish a connection
 const client = new MongoClient(MONGO_URI);
 await client.connect();

 // Specify the database and bucket name
 const dbName = "MLM";
 const bucketName = "UserPaymentQR";

 // Create a GridFSBucket instance
 const bucket = new GridFSBucket(client.db(dbName), { bucketName });

 // Retrieve the file by ObjectId
 const fileId = new ObjectId(fileDetails?._doc?.fileid); // Replace with the ObjectId of the image you want to retrieve
 const downloadStream = bucket.openDownloadStream(fileId);

 // Set the response headers for the file download
 res.set("Content-Type", fileDetails?._doc?.contentType);
 res.set(
   "Content-Disposition",
   `attachment; filename="${fileDetails?._doc?.filename}"`
 );

 // Stream the file data to the response
 downloadStream.on("data", (chunk) => {
   res.write(chunk);
 });

 // Complete the response when the file streaming is finished
 downloadStream.on("end", () => {
   res.end();
 });

 // Handle any errors that may occur during the download
 downloadStream.on("error", (error) => {
   console.error("Error downloading file:", error);
   res
     .status(500)
     .json({ message: "Error downloading file", statusCode: 500 });
 });
    }
    else{
      res.status(200).json({ message: "You do not have any file", statusCode: 200 });

    }

   

    // Close the MongoDB connection
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", statusCode: 500 });
  }
};

export const getPaymentIncome = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const accountId = req.headers.accountid || "";
    if (!accountId) {
      res.status(400).json({
        message: "Account id is required",
        statusCode: 400,
      });
      return;
    }
    const encrypteduserId = await userIdDecryption(accountId.toString());

    const existingDbUserLevel:any = await UserLevels.find({
      userid: encrypteduserId,
    });
    const existingUserLevel= existingDbUserLevel.length ? existingDbUserLevel[0] : [];
    const level1 = existingUserLevel?.level1;
    const level2 = existingUserLevel?.level2;
    const level3 = existingUserLevel?.level3;
    const level4 = existingUserLevel?.level4;
    const level5 = existingUserLevel?.level5;
    const level6 = existingUserLevel?.level6;
    let level1income:number=0;
let level2income:number=0;
let level3income:number=0;
let level4income:number=0;
let level5income:number=0;
let level6income:number=0;

    if(level1){
     const level1accounttypeside1Income = level1.filter((obj:any) => obj.accounttypeside === 1 && obj.status === 1).length;
     const level1accounttypeside2Income = level1.filter((obj:any) => obj.accounttypeside === 2  && obj.status === 1).length;
     level1income = Math.min(level1accounttypeside1Income,level1accounttypeside2Income)*200
    }
    if(level2){
      const level2accounttypeside1Income = level2.filter((obj:any) => obj.accounttypeside === 1 && obj.status === 1).length;
      const level2accounttypeside2Income = level2.filter((obj:any) => obj.accounttypeside === 2  && obj.status === 1).length;
      level2income = Math.min(level2accounttypeside1Income,level2accounttypeside2Income)*100
     }
     if(level3){
      const level3accounttypeside1Income = level3.filter((obj:any) => obj.accounttypeside === 1 && obj.status === 1).length;
      const level3accounttypeside2Income = level3.filter((obj:any) => obj.accounttypeside === 2  && obj.status === 1).length;
      level3income = Math.min(level3accounttypeside1Income,level3accounttypeside2Income)*200
     }
     if(level4){
      const level4accounttypeside1Income = level4.filter((obj:any) => obj.accounttypeside === 1 && obj.status === 1).length;
      const level4accounttypeside2Income = level4.filter((obj:any) => obj.accounttypeside === 2  && obj.status === 1).length;
      level4income = Math.min(level4accounttypeside1Income,level4accounttypeside2Income)*100
     }
     if(level5){
      const level5accounttypeside1Income = level5.filter((obj:any) => obj.accounttypeside === 1 && obj.status === 1).length;
      const level5accounttypeside2Income = level5.filter((obj:any) => obj.accounttypeside === 2  && obj.status === 1).length;
      level5income = Math.min(level5accounttypeside1Income,level5accounttypeside2Income)*200
     }
     if(level6){
      const level6accounttypeside1Income = level6.filter((obj:any) => obj.accounttypeside === 1 && obj.status === 1).length;
      const level6accounttypeside2Income = level6.filter((obj:any) => obj.accounttypeside === 2  && obj.status === 1).length;
      level6income = Math.min(level6accounttypeside1Income,level6accounttypeside2Income)*100
     }
     let totalincome = level1income + level2income + level3income + level4income + level5income + level6income
      if(totalincome >=6500){
        totalincome = 6500
      }
      const responseBody = {
        data: {
          totalincome:totalincome
        },
        message: "success",
        statusCode: 200,
      };
  
      res.status(200).json(responseBody);   
      
  } catch (error) {
    res.status(500).json(error);
  }
};
