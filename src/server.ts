import * as express from "express";
import * as cors from "cors";

import * as database from "./database";
import usersRouter from "./routes/user.route";
import paymentDetailsRouter from "./routes/payment.route";
import adminRouter from "./routes/admin.route";
import { connectDatabase } from "./database";

// Our Express APP config

// API Endpoints

const startServer = async () => {
  // Connect to the database
  await connectDatabase();

  // Rest of your application code here
};

// Our Express APP config
const app = express();
app.use(express.json());

app.use(cors());
app.set("port", process.env.PORT || 3000);
const http = require("http").createServer(app);
startServer()

http.listen(5000, () => {
  console.log("listening on *:5000");
});
// API Endpoints
app.get("/", (req: any, res: any) => {
  res.send("Hello World!");
});
app.use("/api/v1/user", usersRouter);
app.use("/api/v1/user", paymentDetailsRouter);
app.use("/api/v1/admin", adminRouter);

export const server = app.listen(app.get("port"), () => {
  console.log("App is running on http://localhost:%d", app.get("port"));
});
