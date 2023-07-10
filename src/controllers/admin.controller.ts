import { Request, Response } from "express";
import { userIdDecryption } from "../services/security.service";
import { joinUserResponse, userPaymentResponse } from "../data/admin";
import { JoinUserDetails } from "../modals/admin";
import { Users } from "../modals/user";
import { UserLevels } from "../modals/user-level";
import { paymentDetails } from "../modals/payment";
import mongodb, { MongoClient, ObjectId, GridFSBucket } from "mongodb";
import { PayemntToUser } from "../modals/payment-to-user";
import { PaymentHistoryUser } from "../modals/payment-history";
import { ACCOUNT_STATUS, MONGO_URI } from "../data/constant";
import { deleteUserResponse } from "../data/user";

const url = MONGO_URI; // Replace with your MongoDB connection URL
const dbName = "MLM"; // Replace with your database name

const client = new MongoClient(url);

export const joinUser = async (req: Request, res: Response) => {
  const accountid = req.headers.accountid;
  if (!accountid) {
    return res.status(400).send({
      message: "Account id is required",
      statusCode: 400,
    });
  }
  const encrypteduserId = await userIdDecryption(accountid.toString());

  const { amount, senderupiid, paymentmethod, status } = req.body;

  if (!amount) {
    return res.status(400).send({
      message: "amount is required",
      statusCode: 400,
    });
  } else if (!senderupiid) {
    return res.status(400).send({
      message: "senderupiid is required",
      statusCode: 400,
    });
  } else if (!paymentmethod) {
    return res.status(400).send({
      message: "paymentmethod is required",
      statusCode: 400,
    });
  }

  try {
    const newJoinUser = new JoinUserDetails({
      amount: req.body.amount,
      senderupiid: req.body.senderupiid,
      paymentmethod: req.body.paymentmethod,
      status: req.body.status ? req.body.status : 3,
      userid: +encrypteduserId,
    });
    await newJoinUser.save();
    await Users.findOneAndUpdate(
      { userid: +encrypteduserId },
      {
        $set: {
          status: req.body.status ? req.body.status : 3,
        },
      },
      { new: true }
    );
    res.status(200).send(joinUserResponse);
  } catch (err) {
    res.status(500).send(err);
  }
};
export const getAllUsers = async (req: Request, res: Response) => {
  const accountid = req.headers.accountid;
  if (!accountid) {
    return res.status(400).send({
      message: "Account id is required",
      statusCode: 400,
    });
  }
  try {
    const user = await Users.find();
    const responseBody = {
      data: user,
      message: "success",
      statusCode: 200,
    };
    res.status(200).send(responseBody);
  } catch (error) {
    res.status(500).send(error);
  }
};
export const updateUserStatus = async (req: Request, res: Response) => {
  const userid = req.body.userid;
  const status = req.body.status;
  const referbyuserid = req.body.referid;

  if (!userid) {
    return res.status(400).send({
      message: "userid is required",
      statusCode: 400,
    });
  }

  if (!status) {
    return res.status(400).send({
      message: "status is required",
      statusCode: 400,
    });
  }
  try {
    await Users.findOneAndUpdate(
      { userid: +userid },
      { $set: { status: req.body.status } },
      { new: true, upsert: true }
    );
    if (req.body.status == ACCOUNT_STATUS.ACTIVE) {
      // level1 start array
      await UserLevels.findOneAndUpdate(
        { userid: +referbyuserid, "level1.userid": userid },
        { $set: { "level1.$[elem].status": 1 } },
        { new: true, arrayFilters: [{ "elem.userid": userid }] }
      );
      // level1 end array

      // level2 start array
      const level1User: any = await Users.findOne({ userid: +referbyuserid });
      if (level1User?.referbyuserid) {
        await UserLevels.findOneAndUpdate(
          { userid: +level1User?.referbyuserid, "level2.userid": userid },
          { $set: { "level2.$[elem].status": 1 } },
          { new: true, arrayFilters: [{ "elem.userid": userid }] }
        );
      }
      // level2 end array

      // level3 start array

      const level2User: any = await Users.findOne({
        userid: +level1User?.referbyuserid,
      });
      if (level2User?.referbyuserid) {
        await UserLevels.findOneAndUpdate(
          { userid: +level2User?.referbyuserid, "level3.userid": userid },
          { $set: { "level3.$[elem].status": 1 } },
          { new: true, arrayFilters: [{ "elem.userid": userid }] }
        );
        // level4 start array
        if (level2User?.referbyuserid) {
          const level3User: any = await Users.findOne({
            userid: +level2User?.referbyuserid,
          });
          if (level3User?.referbyuserid) {
            await UserLevels.findOneAndUpdate(
              { userid: +level3User?.referbyuserid, "level4.userid": userid },
              { $set: { "level4.$[elem].status": 1 } },
              { new: true, arrayFilters: [{ "elem.userid": userid }] }
            );
            // level5 start array

            const level4User: any = await Users.findOne({
              userid: +level3User?.referbyuserid,
            });
            if (level4User?.referbyuserid) {
              await UserLevels.findOneAndUpdate(
                { userid: +level4User?.referbyuserid, "level5.userid": userid },
                { $set: { "level5.$[elem].status": 1 } },
                { new: true, arrayFilters: [{ "elem.userid": userid }] }
              );
              // level6 start array

              const level5User: any = await Users.findOne({
                userid: +level4User?.referbyuserid,
              });
              if (level5User?.referbyuserid) {
                await UserLevels.findOneAndUpdate(
                  {
                    userid: +level5User?.referbyuserid,
                    "level6.userid": userid,
                  },
                  { $set: { "level6.$[elem].status": 1 } },
                  { new: true, arrayFilters: [{ "elem.userid": userid }] }
                );
              }
              // level6 end array
            }
            // level5 end array
          }
          // level4 end array
        }
      }
    }

    return res.status(200).send({
      message: "User Status updated Successfully",
      statusCode: 200,
    });
  } catch (err) {
    res.status(500).send(err);
  }
};
export const getPaymentDetailsForAdmin = async (
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

    const user = await paymentDetails.findOne({ userid: req.params.userid });

    const responseBody = {
      data: user,
      message: "success",
      statusCode: 200,
    };

    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getQrCodeDetailsForAdmin = async (
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

    const fileDetails: any = await paymentDetails.findOne({
      userid: +req.params.userid,
    });

    if (!fileDetails) {
      res.status(404).json({
        message: "File not found",
        statusCode: 404,
      });
      return;
    }

    // Create a new MongoDB client and establish a connection
    const client = new MongoClient(MONGO_URI);
    await client.connect();

    // Specify the database and bucket name
    const dbName = "MLM";
    const bucketName = "UserPaymentQR";

    // Create a GridFSBucket instance
    const bucket = new GridFSBucket(client.db(dbName), { bucketName });

    // Retrieve the file by ObjectId
    const fileId = new ObjectId(fileDetails?._doc.fileid); // Replace with the ObjectId of the image you want to retrieve
    const downloadStream = bucket.openDownloadStream(fileId);

    // Set the response headers if the file exists
    if (fileDetails?._doc?.contentType && fileDetails?._doc?.filename) {
      res.set("Content-Type", fileDetails?._doc?.contentType);
      res.set(
        "Content-Disposition",
        `attachment; filename="${fileDetails?._doc?.filename}"`
      );
    }

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

    // Close the MongoDB connection
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", statusCode: 500 });
  }
};
export const payPaymentToUser = async (req: Request, res: Response) => {
  const accountid = req.headers.accountid;
  if (!accountid) {
    return res.status(400).send({
      message: "Account id is required",
      statusCode: 400,
    });
  }

  const { amount, userid } = req.body;

  if (!amount) {
    return res.status(400).send({
      message: "amount is required",
      statusCode: 400,
    });
  } else if (!userid) {
    return res.status(400).send({
      message: "userid is required",
      statusCode: 400,
    });
  }

  try {
    let user = await PayemntToUser.findOne({ userid });
    if (!user) {
      user = new PayemntToUser({ userid, amount });
    } else {
      user.amount += amount;
    }
    const newPaymentHistory = new PaymentHistoryUser({
      amount: amount,
      userid: userid,
    });
    await newPaymentHistory.save();
    await user.save();
    res.status(200).send(userPaymentResponse);
  } catch (err) {
    res.status(500).send(err);
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  const { userid } = req.body;
  if (!userid) {
    return res.status(400).send({
      message: "userid is required",
      statusCode: 400,
    });
  }
  try {
    const userid = req.body.userid;
    await Users.deleteOne({ userid: userid });
    res.status(200).send(deleteUserResponse);
  } catch (error) {
    res.status(500).send(error);
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

    const existingUserLevel = await UserLevels.findOne({
      userid: req.params.userid,
    });
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
export const getPaymentHistory = async (req: Request, res: Response) => {
  const accountid = req.headers.accountid;
  if (!accountid) {
    return res.status(400).send({
      message: "Account id is required",
      statusCode: 400,
    });
  }

  try {
    const user = await PaymentHistoryUser.find({ userid: +req.params.userid });
    const responseBody = {
      data: user,
      message: "success",
      statusCode: 200,
    };
    res.status(200).send(responseBody);
  } catch (error) {
    res.status(500).send(error);
  }
};