const express = require("express");
const authRouter = express.Router();
const {validateSignup} = require("../utils/validation")
const User = require("../models/user");
const validator = require("validator")
const bcrypt = require("bcrypt")
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignup(req);
    const { password, emailId } = req.body;
    const userExists = await User.findOne({ emailId });
    if (userExists) {
      throw new Error("User already exists with that email...");
    }
    const passwordHash = await bcrypt.hash(password, 10);

    const userObj = new User({ ...req.body, password: passwordHash });
    const newUser = await userObj.save();
    const token = await newUser.getJwt();
    res.cookie("token", token);
    res.status(200).json({data: newUser})
  } catch (err) {
    console.log("Error saving the document", err.message);
    res.status(500).send(err.message);
  }
});
authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    if (!validator.isEmail(emailId)) {
      throw new Error("emailid is not valid..");
    }
    const user = await User.findOne({ emailId });
    const isCorrectPassword = await user.validatePassword(password);
    if (!isCorrectPassword) {
      throw new Error("invalid password...");
    }
    const token = await user.getJwt();
    res.cookie("token", token);
    res.status(200).send(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{expires: new Date(Date.now())}).send("Logged out succesfully")
})
module.exports = {authRouter}
