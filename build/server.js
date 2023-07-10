"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const database = require("./database");
const user_route_1 = require("./routes/user.route");
const databases = database;
const app = express();
app.use(express.json());
app.use(cors());
app.set("port", process.env.PORT || 3000);
const http = require('http').createServer(app);
http.listen(5000, () => {
    console.log('listening on *:5000');
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use("/api/v1/user", user_route_1.default);
const server = app.listen(app.get("port"), () => {
    console.log("App is running on http://localhost:%d", app.get("port"));
});
//# sourceMappingURL=server.js.map