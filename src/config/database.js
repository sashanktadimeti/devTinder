const mongoose = require("mongoose");
const connectDb = async (connstring) => {
  return await mongoose.connect(connstring);
};
module.exports = { connectDb };
