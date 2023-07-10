import * as mongoose from "mongoose";
import { MONGO_URI } from "./data/constant";
const uri: string =  MONGO_URI;
mongoose.connect(uri, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Successfully Connected!");
    }
});