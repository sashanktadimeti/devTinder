const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
requestRouter.get("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  res.send(user);
});
module.exports = { requestRouter };
