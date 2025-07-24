const express = require('express')
const requestRouter = express.Router()
const { userAuth } = require('../middlewares/auth')
const User = require('../models/user')
const ConnectionRequest = require('../models/connectionRequest')
requestRouter.post(
  '/sendConnectionRequest/:status/:toUserId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id
      const toUserId = req.params.toUserId
      const touser = await User.findOne({ _id: toUserId })
      if (!touser) {
        throw new Error('invalid request ....')
      }
      const status = req.params.status
      const allowed = ['rejected', 'interested']
      if (!allowed.includes(status)) {
        throw new Error('status in not valid')
      }
      const redundantConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      })
      if (redundantConnection) {
        throw new Error('connection already exists!!!')
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      })
      await connectionRequest.save()
      res
        .status(200)
        .json({
          message: `request to ${touser.firstName} has been sent successfully`,
        })
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }
)
requestRouter.post('/review/:status/:requestId', userAuth, async (req, res) => {
  try {
    const requestId = req.params.requestId
    const allowed = ['accepted', 'rejected']
    const status = req.params.status
    if (!allowed.includes(status)) {
      throw new Error('invalid status code...')
    }
    const connectionrequest = await ConnectionRequest.findOne({fromUserId: requestId, toUserId: req.user._id, status: "interested"})
    if(!connectionrequest){
      throw new Error("the connection record doesn't exist!!!")
    }
    connectionrequest.status = status
    await connectionrequest.save()
    res.status(200).json({message : `you have accepted ${connectionrequest.fromUserId.firstName}`})
  } catch (err) {
    res.status(404).json({ message: err.message })
  }
})
module.exports = { requestRouter }
