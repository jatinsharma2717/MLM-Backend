"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const uri = "mongodb+srv://jatinsharmaaj:123456Jhu@cluster0.nxypk97.mongodb.net/?retryWrites=true&w=majority

/MLM";
mongoose.connect(uri, (err) => {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log("Successfully Connected!");
    }
});
//# sourceMappingURL=database.js.map