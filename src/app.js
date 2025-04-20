const express = require("express");
const app = express();
const { connectDb } = require("./config/database");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
const {authRouter} = require("./routes/auth")
const {profileRouter} = require("./routes/profile")
const {requestRouter} = require("./routes/requests")
app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
connectDb(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server created successfully..");
    });
  })
  .catch((err) => {
    console.log(
      "Can't create a server due to unsuccessful database connection..."
    );
  });
