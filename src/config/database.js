const mongoose=require("mongoose")
const connstring="mongodb+srv://sashanktadimeti4:sashank@cluster0.mkna2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const connectDb=async()=>{
     return await mongoose.connect(connstring)
}
module.exports={connectDb}