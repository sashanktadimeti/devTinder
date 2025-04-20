const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid edit request....");
    }
    const user = req.user;
    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });
    await user.save();
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});
profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const isValidPassword = await user.validatePassword(req.body.password)
    if (!isValidPassword) {
      throw new Error("current password doesnt match");
    }
    if (!validator.isStrongPassword(req.body.changedPassword)) {
      throw new Error("password is not strong");
    }
    user["password"] = await bcrypt.hash(req.body.changedPassword,8);
    await user.save();
    res
      .status(200)
      .json({ message: "password has been updated succesfully", user: user });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});
module.exports = { profileRouter };
