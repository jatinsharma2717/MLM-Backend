import { Request, Response } from "express";
import {
  userIdDecryption,
  userIdEncryption,
} from "../services/security.service";
import {
  deleteUserResponse,
  logoutUserResponse,
  registerUserResponse,
} from "../data/user";
import { Users } from "../modals/user";
import { UserAccountDetails } from "../modals/user-details";
import { generateUserId } from "../services/userid.service";
import { ActiveUsers } from "../modals/active-user";
import * as jwt from "jsonwebtoken";
import { ACCOUNT_SIDE, ACCOUNT_STATUS, JWT_SECRET_KEY } from "../data/constant";
import { UserLevels } from "../modals/user-level";
import { PaymentHistoryUser } from "../modals/payment-history";

export const registerUser = async (req: Request, res: Response) => {
  const {
    email,
    password,
    firstname,
    lastname,
    confirmpassword,
    mobilenumber,
  } = req.body;

  if (!email) {
    return res.status(400).send({
      message: "Email is required",
      statusCode: 400,
    });
  } else if (!password) {
    return res.status(400).send({
      message: "Password is required",
      statusCode: 400,
    });
  } else if (!firstname) {
    return res.status(400).send({
      message: "firstname is required",
      statusCode: 400,
    });
  } else if (!lastname) {
    return res.status(400).send({
      message: "lastname is required",
      statusCode: 400,
    });
  } else if (!mobilenumber) {
    return res.status(400).send({
      message: "mobilenumber is required",
      statusCode: 400,
    });
  } else if (!confirmpassword) {
    return res.status(400).send({
      message: "confirmpassword is required",
      statusCode: 400,
    });
  }
  if (req.body.password !== req.body.confirmpassword) {
    return res.status(400).send({
      message: "Password and confirm password do not match",
      statusCode: 400,
    });
  }

  try {
    const referDetails = req.body?.referralcode;
    const userid = await generateUserId();
    let side = 3;
    let referbyuserid: number = 0;
    if (referDetails) {
      side = +referDetails.substr(referDetails.length - 1);
      referbyuserid =
        (+referDetails.substring(0, referDetails.length - 1) - 99) / 10;
      const newUser = new Users({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobilenumber: req.body.mobilenumber,
        referbyuserid: +referbyuserid,
        referralcode: 10 * userid + 99,
        accounttypeside: +side,
        password: req.body.password,
        userid: userid,
      });

      // level1 start array
      await UserLevels.findOneAndUpdate(
        { userid: +referbyuserid },
        { $addToSet: { level1: {
          userid:userid,
          accounttypeside: +side,
          status:  2 
        } } },
        { new: true, upsert: true }
      );
      // level1 end array
      
      // level2 start array
      const level1User: any = await Users.find({ userid: +referbyuserid });
      if (level1User?.referbyuserid) {
        await UserLevels.findOneAndUpdate(
          { userid: +level1User?.referbyuserid },
          { $addToSet: { level2: {
            userid:userid,
            accounttypeside: +side,
            status:  2
          } } },
          { new: true, upsert: true }
        );
      }
      // level2 end array

      // level3 start array

      const level2User: any = await Users.find({
        userid: +level1User?.referbyuserid,
      });
      if (level2User?.referbyuserid) {
        await UserLevels.findOneAndUpdate(
          { userid: +level2User?.referbyuserid },
          { $addToSet: { level3: {
            userid:userid,
            accounttypeside: +side,
            status:  2
          } } },
          { new: true, upsert: true }
        );
         // level4 start array
      if (level2User?.referbyuserid) {
        const level3User: any = await Users.find({
          userid: +level2User?.referbyuserid,
        });
        if (level3User?.referbyuserid) {
          await UserLevels.findOneAndUpdate(
            { userid: +level3User?.referbyuserid },
            { $addToSet: { level4: {
              userid:userid,
              accounttypeside: +side,
              status:  2
            } } },
            { new: true, upsert: true }
          );
          // level5 start array

          const level4User: any = await Users.find({
            userid: +level3User?.referbyuserid,
          });
          if (level4User?.referbyuserid) {
            await UserLevels.findOneAndUpdate(
              { userid: +level4User?.referbyuserid },
              { $addToSet: { level5: {
                userid:userid,
                accounttypeside: +side,
                status:  2
              } } },
              { new: true, upsert: true }
            );
            // level6 start array

            const level5User: any = await Users.find({
              userid: +level4User?.referbyuserid,
            });
            if (level5User?.referbyuserid) {
              await UserLevels.findOneAndUpdate(
                { userid: +level5User?.referbyuserid },
                { $addToSet: { level6: {
                  userid:userid,
                  accounttypeside: +side,
                  status:  2
                } } },
                { new: true, upsert: true }
              );
            }
            // level6 end array
          }
          // level5 end array
        }
        // level4 end array
      }
      }
      // level3 end array

     

      await UserLevels.findOneAndUpdate(
        { userid: userid },
        {
          $set: {
            referbyuserid: +referbyuserid,
            level1: [],
            level2: [],
            level3: [],
            level4: [],
            level5: [],
            level6: [],
          },
        },
        { new: true, upsert: true }
      );
      await newUser.save();
    } else {
      const userid = await generateUserId();
      const newUser = new Users({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        mobilenumber: req.body.mobilenumber,
        referbyuserid: +referbyuserid,
        referralcode: 10 * userid + 99,
        accounttypeside: +side,
        password: req.body.password,
        userid: userid,
      });
      await newUser.save();
      await UserLevels.findOneAndUpdate(
        { userid: userid },
        {
          $set: {
            referbyuserid: +referbyuserid,
            level1: [],
            level2: [],
            level3: [],
            level4: [],
            level5: [],
            level6: [],
          },
        },
        { new: true, upsert: true }
      );
    }

    // if(referDetails){
    //   const existingUserLevel = await UserLevels.find({
    //     refereduserid: referbyuserid,
    //   });
    // let newLevels: { [key: string]: any } = existingUserLevel?.levels || {};
    // if (!Object.keys(newLevels).length) {
    //   newLevels["level1"] = [{ userid: userid, accounttypeside: +side }]; // User id as a number
    // } else {
    //   if (!newLevels.get("level1")) {
    //     newLevels["level1"] = [];
    //   }
    //   let count0 = 0,
    //     count1 = 0;

    //   // Function to check if user exists in any level
    //   let latestLevelKey: string = "";
    //   let latestLevelNumber: number = 0;

    //   // Function to check if user exists in any level
    //   const doesUserExist = (userid: number) => {
    //     for (let levelArray of newLevels.values()) {
    //       if (levelArray.some((item: any) => item.userid == userid)) {
    //         return true;
    //       }
    //     }
    //     return false;
    //   }

    //   const newUser = { userid: userid, accounttypeside: +side };

    //   for (const [levelKey, levelArray] of newLevels.entries()) {
    //     const levelNumber = parseInt(levelKey.replace('level', ''));
    //     if (levelNumber > latestLevelNumber) {
    //       latestLevelNumber = levelNumber;
    //       latestLevelKey = levelKey;
    //     }
    //   }

    //   for (const [levelKey, levelArray] of newLevels.entries()) {
    //     if (!doesUserExist(newUser.userid)) {
    //       const filteredArray = levelArray.filter((item: any) => item.status == ACCOUNT_STATUS.ACTIVE);

    //       if (filteredArray.length) {
    //         count0 = filteredArray.filter((item: any) => item.accounttypeside == ACCOUNT_SIDE.RIGHT).length;
    //         count1 = filteredArray.filter((item: any) => item.accounttypeside == ACCOUNT_SIDE.LEFT).length;

    //         const areCountsEqual = count0 == count1;
    //         if (areCountsEqual) {
    //           if (levelKey == latestLevelKey) {
    //             const levelToAdd = 'level' + (parseInt(latestLevelKey.replace('level', '')) + 1)
    //             // check if the level exists; if not, initialize it
    //             if (!newLevels.has(levelToAdd)) {
    //               newLevels.set(levelToAdd, []);
    //               newLevels.get(levelToAdd).push(newUser);
    //             }
    //           }

    //         }
    //         else {
    //           latestLevelKey = latestLevelKey;
    //           newLevels.get(latestLevelKey).push(newUser);

    //         }

    //         // Add the new user to the level
    //       } else {
    //         newLevels.get(latestLevelKey).push(newUser);
    //       }
    //     }
    //   }

    // }

    // await UserLevels.findOneAndUpdate(
    //   { userid: referbyuserid },
    //   {
    //     $set: {
    //       userid: referbyuserid,
    //       levels: newLevels,
    //     },
    //   },
    //   { new: true, upsert: true }
    // );
    // }
    
    const registerResponse = {...registerUserResponse,userid}
    res.status(200).send(registerResponse);
  } catch (err) {
    res.status(500).send(err);
  }
};
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { userid, password } = req.body;

    if (!userid) {
      return res.status(400).send({
        message: "userid is required",
        statusCode: 400,
      });
    }

    if (!password) {
      return res.status(400).send({
        message: "Password is required",
        statusCode: 400,
      });
    }

    const existingUser:any = await Users.find({ userid:userid });

    if (!existingUser) {
      return res.status(400).send({
        message: "Invalid credentials",
        statusCode: 400,
      });
    }
    if (!(password == existingUser.password)) {
      return res.status(400).send({
        message: "Invalid credentials",
        statusCode: 400,
      });
    }

    const newActiveUser = new ActiveUsers({
      userid: existingUser.userid,
    });
    await newActiveUser.save();
    const token = jwt.sign({ userid: existingUser.userid }, JWT_SECRET_KEY, {
      expiresIn: "24hr",
    });

    const encrypteduserId = await userIdEncryption(
      existingUser.userid.toString()
    );
    res.status(200).send({
      message: "Login successful",
      statusCode: 200,
      data: {
        accountid: encrypteduserId,
        bearertoken: token,
        status: existingUser.status,
        referralcode: existingUser.referralcode,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Internal server error",
      statusCode: 500,
    });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send({
      message: "Email is required",
      statusCode: 400,
    });
  }
  try {
    const email = req.body.email;
    await Users.deleteOne({ email: email });
    res.status(200).send(deleteUserResponse);
  } catch (error) {
    res.status(500).send(error);
  }
};
export const updateUserDetails = async (req: Request, res: Response) => {
  const accountid = req.headers.accountid;
  if (!accountid) {
    return res.status(400).send({
      message: "Account id is required",
      statusCode: 400,
    });
  }
  const encrypteduserId = await userIdDecryption(accountid.toString());

  try {
    let userDetail: any;
    if (req.body.password) {
      userDetail = await Users.findOneAndUpdate(
        { userid: +encrypteduserId },
        {
          $set: {
            password: req.body.password,
          },
        },
        { new: true }
      );
    } else {
      userDetail = await Users.findOneAndUpdate(
        { userid: +encrypteduserId },
        {
          $set: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            mobilenumber: req.body.mobilenumber,
          },
        },
        { new: true }
      );
    }
    if (req.body.location) {
      await UserAccountDetails.findOneAndUpdate(
        { userid: userDetail?.userid },
        {
          $set: {
            location: req.body.location,
          },
        },
        { new: true, upsert: true }
      );
    }

    const response = {
      data: userDetail,
      message: "success",
      statusCode: 200,
    };
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  const accountid = req.headers.accountid;
  if (!accountid) {
    return res.status(400).send({
      message: "Account id is required",
      statusCode: 400,
    });
  }
  const encrypteduserId = await userIdDecryption(accountid.toString());

  try {
    const user = await Users.find({ userid: +encrypteduserId });
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
export const logoutUser = async (req: Request, res: Response) => {
  const accountid = req.headers.accountid;
  if (!accountid) {
    return res.status(400).send({
      message: "Account id is required",
      statusCode: 400,
    });
  }
  const encrypteduserId = await userIdDecryption(accountid.toString());
  try {
    await ActiveUsers.deleteMany({ userid: +encrypteduserId });
    res.status(200).send(logoutUserResponse);
  } catch (error) {
    res.status(500).send(error);
  }
};
export const getReferredUsers = async (req: Request, res: Response) => {
  const accountid = req.headers.accountid;
  if (!accountid) {
    return res.status(400).send({
      message: "Account id is required",
      statusCode: 400,
    });
  }
  const encrypteduserId = await userIdDecryption(accountid.toString());

  try {
    const user = await UserLevels.find({ userid: encrypteduserId });
    const responseBody = {
      data:  user ? user[0] : {},
      message: "success",
      statusCode: 200,
    };
    res.status(200).send(responseBody);
  } catch (error) {
    res.status(500).send(error);
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
  const encrypteduserId = await userIdDecryption(accountid.toString());

  try {
    const user = await PaymentHistoryUser.find({ userid: +encrypteduserId });
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
