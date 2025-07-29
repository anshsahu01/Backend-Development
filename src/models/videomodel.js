import mongoose,{Schema} from "mongoose";
// MONGOOSE MENI AGGREGATION FRAMEWORK SIKHO DOCS PAD KAR

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema=new Schema(
    {

        videoFile:{
            type:String,//cloudinary url
            required:true,

        },

        thumbnail:{
            type:String,
            required:true,
        },

          title:{
            type:String,
            required:true,
        },

          description:{
            type:String,
            required:true,
        },

        duration:{
            type:Number,// video duration you get from cloudinary

        },

        views:{
            type:Number,
            default:0,
        },

        isPublisher:{
            type:Boolean,
            default:true,
        },

        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }



}

,
{timestamps:true}
)

videoSchema.plugin(mongooseAggregatePaginate)

export const Video=mongoose.model("Video",videoSchema)


// BYCRYPT - PASSWORD HASHING LIBRARY HAI Hash passwords securely
// Compare hashed passwords during login

// JWT --- 🔐 What is JWT?
// JWT (JSON Web Token) ek secure token hai jo user ke login ke baad backend generate karta hai aur frontend ko bhejta hai.

// 🔑 Iska kaam:
// User ko authenticate (verify) karna without storing session in backend. 