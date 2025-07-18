import mongoose, {Schema} from "mongoose";
import bcyrpt from "bcrypt"
import jwt from "jsonwebtoken";



const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,
    },

    email:{
        type:String,
        required:true,
        unique:true, 
         lowercase:true,
        trim:true,
    },

    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true

    },

    avatar:{
        type:String,// cloudinary URL
        required:true,
        

    },

    coverimage:{
        type:String,

    },

    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }

    ],

    password:{
        type:String,
        required:[true,"Password is required"],
    },

    refreshToken:{
        type:String
    }



    
},{
    timestamps:true
})


userSchema.pre("save",async function(next){
    if(this.isModified("password")) return next();

    
    this.password= await bcyrpt.hash(this.password,10) //password ka encryption hogya
    next();

})//yahan per callback ka use nhi kiya ja sakta kyoki callback mein this ka access nhi hota
// aur he humesha async hi hota hai

userSchema.methods.isPasswordcorrect=async function name(password) {
    return await bcyrpt.compare(password,this.password);//is method mein password and encrypted password dena hota hai
    
}

userSchema.methods.generateAccessToken=function(){
   return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }

    )
};
userSchema.methods.generateRefreshToken=function(){

    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }

    )
};


export const User=mongoose.model("User",userSchema)


// JWT ek bearer token hai 


