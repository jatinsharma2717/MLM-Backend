"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const constant_1 = require("./data/constant");
const uri = constant_1.MONGO_URI;
const connectDatabase = async () => {
    try {
        await mongoose.connect(uri, (err) => {
            if (err) {
                console.log(err.message);
            }
            else {
                console.log("Successfully Connected!");
            }
        });
        console.log("connected to database");
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
};
connectDatabase();
//# sourceMappingURL=database.js.map