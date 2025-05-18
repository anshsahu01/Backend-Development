 import mongoose from "mongoose";
 import { DB_NAME } from "../constants.js";
 console.log("Mongo URI:", `${process.env.MONGODB_URL}/${DB_NAME}`);

 const connectDB=async ()=>{
    try {
    // assignment - connection instance ko console log karo and see what it gives
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB Host : ${connectionInstance.connection.host}`)

        
    } catch (error) {
        console.log("Error in mongoDB connection",error);
        throw error;
        
    }
 }

 export default connectDB;