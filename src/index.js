
// require('dotenv').config({path:'./env'}) -  aise bhi kar sakte ho but ye code ki consistency ko kharab karta hai isiliye neeche better tarika diya hai


// import mongoose, { connect } from "mongoose";
// import { DB_NAME } from "./constants.js";
import express from "express";
import connectDB from "./db/db.js";
import app from "./app.js";

import dotenv from "dotenv"

// const app=express()
 
// (async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//         app.on("error",()=>{
//             console.log("error",error);
//             throw error;
//         })

//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.log("Error in DB connect",error);
//         throw error;
//     }
// })()

//

//ismein humne immediately invoked function use kiya hai ()()

// ANOTHER APPROACH

dotenv.config({
    path:'./env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server is running at PORT : ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("MONGO DB CONNECTION FAILED ! ! !",error)
})

