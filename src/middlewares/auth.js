const jwt = require("jsonwebtoken");
const user = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("request is not valid...");
    }
    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET)
    const { _id } = decodedMessage;
    req.user = await user.findById({ _id });
    if (!req.user) {
      throw new Error("user doesn't exist!!!!!");
    }
    next();
  } catch (err) {
    res.send(err.message);
  }
};
module.exports = { userAuth };
