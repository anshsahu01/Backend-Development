import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/Apiresponse.js";
import jwt from "jsonwebtoken"

// access and refresh tokens baar baar generate karne honge isiliye ek method banalo
const genereateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findOne(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false }); // ye isiliye add kiya kyuki jab bhi user use hoga to user model activate hoga and use password chahiye hoga

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  console.log(req.files);

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

  const { fullname, email, username, password } = req.body; // yahan per humne pehle hi destructure kar liya hai
  console.log("email", email);

  //ab hum conditions lagayenge for validation
  //  if(fullname===""){
  //      throw  ApiError(400,"fullname is required");
  //  }

  // aise bhot saari conditions lagani hongi
  // so we use some

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All field are necessary");
  }

  // ab hum check karenge ki kya ye user aleready exist karta hai ya nhyi
  // vo check hoga ki db mein agar vo same mail hai ya nhi
  // iske liye hum user model ki help lenge

  console.log("Incoming email:", email);
  console.log("Incoming username:", username);

  const existedUser = await User.findOne({
    $or: [{ username }, { email }], // ye operators hai study about them
  });

  console.log("Matched user from DB:", existedUser);

  if (existedUser) {
    throw new ApiError(409, "User with email or username aleready exists");
  }

  // ab file handling check karenge

  const avatarLocalPath = req.files?.avatar[0]?.path; //ismein humne directly multer se access liya path ka
  // ab cover image ka path

  // const coverImagePath=req.files?.coverImage[0]?.path;

  // let converImageLocalPath;  it is an important check if it gives undefined
  // if(req.files && Array.isArray(req.files.coverImage)&&req.files.coverImage.length>0){
  //     converImageLocalPath=req.files.coveImgae[0].path;
  // }
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // now imwe will upload the cover image and avatar on the cloudinary

  const avatar = await uploadOnCloudinary(avatarLocalPath); //kyoki ye time lagayega isiliye await
  // const coverImage=await uploadOnCloudinary(coverImagePath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // next step object banao and db mein entry karo

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    // coverImage:coverImage?.url || "", //coverimage compulsory nhi isiliye upar check nhi kiya
    email,
    password,
    username: username.toLowerCase(),
  });

  // ab check karenge ki user create hua ya nhi
  //iske liye bhi hum db ki help lenge

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken" // jo jo fields nhi chahiye vo - sign lagakar .select() ke andar likh do
    //saare parameters space dekar likhna hai
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  // ab response bhejenge

  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});
// production grade mein validation ki bhi separate files hoti hai

// ab login ka controller

const loginUser = asyncHandler(async (req, res) => {
  // req->body  ->data
  //username or email se check karenge
  //find the user
  // password check -> nhi ho to warning do ki password incorrect hai

  //send cookie
  // and response bhej do

  const { email, password, username } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user =await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User Does Not Exist");
  }
  console.log(user);

  // agar user mil gya hai to password check karo
  // bycrypt se check karenge

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  const { accessToken, refreshToken } = await genereateAccessAndRefreshTokens(user._id); // ye hume access and refresh token return karege

  // par abhi bhi ek problem hai jo user hai vo model se a rha hai and vahan per to accessa token and refresh token empty hai
  // usko update karna hoga

  const loggedInUser = await User.findOne(user._id).select(
    "-password -refreshToken"
  );

  // ab cookies bhejenge
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200) // ye cookie hum yahan isiliye access kar pa rhe hai kyuki app.js mein humne cookie parser kiya in app.use()
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In successsfully "
      )
    );
});


//logout ke liye controller

const logoutUser = asyncHandler(async (req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken:undefined 
      }
    },
    {
      new:true 
    }
   );

    const options = {
    httpOnly: true,
    secure: true,
  };


  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(new ApiResponse(200, {}, "User Logged Out"))
})


// agar frontend se koi bhi request aur usmein 401 aata hai login ke time to frontend ko ek end point de sakte hai jisse use hum refresh token ka access dede aur wahan se use naya access token mile and user ko wapas login karne ki zarurat na pade
// ye wala controller uske liye hai

const refreshAccessToken = asyncHandler(async (req,res)=>{
  try {
    // sabse pehle hum refresh toke le lenge ya to req.body se ya to cookies se
    const incomingToken = req.body || req.cookies?.refreshToken;
  
    if(!incomingToken){
      throw new ApiError(401,"Unauthorized Access");
    }
  
    // ab is token ko verify bhi karna padhege k sahi hai ya nhi
  
    const decodedToken = jwt.verify(incomingToken,process.env.REFRESH_TOKEN_SECRET);
  
    // now we will get user by calling the usermodel and will find by id which is present in the token
    const user = await User.findById(incomingToken?._id);
  
    if(!user){
      throw new ApiError(401,"Invalid refresh token");
    }
    // now user se bi ek token milega
  
    if(incomingToken !== user?.refreshToken){
      throw ApiError(401 , "User token is either expired or used");
    };
  
  // ab jab validation ho gya hai to hum ek naya token generate karenge and use repsonse mein send kar denge
  
  const {accessToken, newRefreshToken} = await genereateAccessAndRefreshTokens(user._id);
  
  
  const options = {
    httpOnly : true,
    secure : true,
  }
  
  // ab response bhejenge
  
  return res
  .status(200)
  .cookie("accessToken",accessToken,options)
  .cookie("refreshToken",newRefreshToken,options)
  .json(
    new ApiResponse(
      200,
      {accessToken,refreshToken:newRefreshToken},
      "Access Token Refreshed Successfully"
    )
  )
   
  }
   catch (error) { 
    throw new ApiError(401,error?.message||"Invalid Refresh Token");
    
  
  
  

  
  }})

export { registerUser, loginUser, logoutUser, refreshAccessToken };
