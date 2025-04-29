const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userInfoRouter = express.Router();
const User = require("../models/user");
userInfoRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const interestedRequests = await ConnectionRequest.find({
      toUserId: userId,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "age",
      "skills",
    ]);
    const data = interestedRequests.map((row) => {
      return row.fromUserId;
    });
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
userInfoRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedinuser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedinuser._id, status: "accepted" },
        { toUserId: loggedinuser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "skills",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "age",
        "skills",
      ]);
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.equals(loggedinuser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
userInfoRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedinuser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const hideUsersFromFeed = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedinuser._id }, { toUserId: loggedinuser._id }],
    }).select("fromUserId toUserId");
    const hideSet = new Set();
    hideUsersFromFeed.forEach((row) => {
      hideSet.add(row.fromUserId.toString());
      hideSet.add(row.toUserId.toString());
    });
    const showUsers = await User.find({
      _id: { $nin: Array.from(hideSet) },
    })
      .skip(skip)
      .limit(limit);
    res.status(200).json(showUsers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = { userInfoRouter };
