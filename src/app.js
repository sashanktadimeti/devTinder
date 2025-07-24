const express = require("express");
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { connectDb } = require("./config/database");
const cookieParser = require("cookie-parser");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/requests");
const { userInfoRouter } = require("./routes/userInfo");

const app = express();

// CORS for preflight
app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
}));
app.options("*", cors()); // <= 👈 very important line for preflight handling

// Parse JSON and cookies
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: process.env.ORIGIN, credentials: true}));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userInfoRouter);

connectDb(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server created successfully");
    });
  })
  .catch(() => {
    console.log(
      "Can't create a server due to unsuccessful database connection..."
    );
  });
