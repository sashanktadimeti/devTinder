const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const { connectDb } = require("./config/database");
const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const { requestRouter } = require("./routes/requests");
const { userInfoRouter } = require("./routes/userInfo");

const app = express();

// CORS for preflight
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
}));
app.options("*", cors()); // <= 👈 very important line for preflight handling

// Parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userInfoRouter);

// Start server
connectDb(process.env.MONGO_URI)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
