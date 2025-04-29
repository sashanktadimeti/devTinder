const mongoose = require('mongoose')
const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    status: {
      type: String,
      enum: {
        values: ['ignored', 'interested', 'accepted', 'rejected'],
        message: `{VALUE} is not valid status type`,
      },
    },
  },
  { timestamps: true }
)
connectionRequestSchema.pre('save', function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("can't send request to yourself!!!")
  }
  next()
})
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })
const ConnectionRequestModel = new mongoose.model(
  'ConnectionRequest',
  connectionRequestSchema
)
module.exports = ConnectionRequestModel
