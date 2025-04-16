const mongoose=require("mongoose")
const connstring=process.env.MONGO_URI
console.log(connstring)
const connectDb=async()=>{
     return await mongoose.connect(connstring)
}
module.exports={connectDb}