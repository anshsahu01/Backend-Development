import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import Apiresponse from "../utils/Apiresponse.js";


const registerUser=asyncHandler(async (req,res)=>{
   
 // to register a user we need
 // user details from frontend
 // validation - not empty
 // check if user aleready exist : check by email or username
 //check for images, check for avatar
 //if images given then upload them to cloudinary 
 // then create user object - create entry in db
 // remove password and refresh token field from repsonse
 //check for the user creation - response aaya ya nhi
 // return response 

 // details - req.body mein milegi

 const {fullname,email,username,password}=req.body // yahan per humne pehle hi destructure kar liya hai
 console.log("email",email);

 //ab hum conditions lagayenge for validation
//  if(fullname===""){
//      throw  ApiError(400,"fullname is required");
//  }

// aise bhot saari conditions lagani hongi
// so we use some 

if(
    [fullname,email,username,password].some(
        (field)=>
            field?.trim()===""
    )
) {
    throw new ApiError(400,"All field are necessary")
}

// ab hum check karenge ki kya ye user aleready exist karta hai ya nhyi
// vo check hoga ki db mein agar vo same mail hai ya nhi
// iske liye hum user model ki help lenge


const existedUser= User.findOne({
    $or: [{ username },{ email }] // ye operators hai study about them
})

if(existedUser) {
    throw new ApiError(409,"User with email or username aleready exists");
}



// ab file handling check karenge

const avatarLocalPath = req.files?.avatar[0]?.path;//ismein humne directly multer se access liya path ka
// ab cover image ka path

const coverImagePath=req.files?.coverimage[0]?.path;


if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required");
}
 
// now we will upload the cover image and avatar on the cloudinary

const avatar=await uploadOnCloudinary(avatarLocalPath) //kyoki ye time lagayega isiliye await
const coverImage=uploadOnCloudinary(coverImagePath);


if(!avatar){
    throw new ApiError(400,"Avatar file is required");

}


// next step object banao and db mein entry karo

const user = await User.create({fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || "", //coverimage compulsory nhi isiliye upar check nhi kiya
    email,
    password,
    username:username.tolowercase()

});

// ab check karenge ki user create hua ya nhi
//iske liye bhi hum db ki help lenge

const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"  // jo jo fields nhi chahiye vo - sign lagakar .select() ke andar likh do
    //saare parameters space dekar likhna hai
);

if(!createdUser){
    throw new ApiError(500,"Something went wrong while registering user");
    
}

// ab response bhejenge

res.status(201).json(
    new Apiresponse(200,createdUser,"User registered successfully")
)
}) 
// production grade mein validation ki bhi separate files hoti hai






export {registerUser};