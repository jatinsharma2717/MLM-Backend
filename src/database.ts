import * as mongoose from "mongoose";
import { MONGO_URI } from "./data/constant";
const uri: string =  MONGO_URI;
const connectDatabase = async () => {
    try {
      
    await mongoose.connect(uri, (err: any) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log("Successfully Connected!");
        }
    });
  
      console.log("connected to database");
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  connectDatabase();