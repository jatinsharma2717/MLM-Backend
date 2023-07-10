import * as mongoose from "mongoose";
const uri: string = "mongodb+srv://jatinsharmaaj:123456Jhu@cluster0.nxypk97.mongodb.net/MLM";
mongoose.connect(uri, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Successfully Connected!");
    }
});