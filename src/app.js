const express=require("express")
const app=express()
const {connectDb}=require("./config/database")
connectDb().then((data)=>{
    app.listen(3000,()=>{
        console.log("server created succesfully..");
        })  
})
.catch((err)=>{
    console.log("cant create a server due to unsuccesful database connection...")
})