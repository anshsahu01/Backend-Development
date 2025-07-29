

import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();


app.use(cors( //app.use method cofigurations and cors ke liye use hota hai

    {
        origin:'*' , //process.env.CORS_ORIGIN,
        credentials:true,
    }



));


app.use(express.json( //it means ki hum json bhi accept kar rhe hai
    {
        limit:"16kb", 
    }
))

app.use(express.urlencoded({ // url se data lena ho to
    extended:true,
    limit:"16kb",
}))


app.use(express.static("public"))


app.use(cookieParser());




//routes import
import router from "./routes/user.routes.js";


// routes declaration
// app.use("/users",userRouter); 

app.use("/api/v1/users",router);//jo uper likha hai vaise bhi likh saktehai but ye wala standard practise hai
app.use("/api/v1/users",router);// ye login ke liye



export default app

