import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { OAuth2Client } from 'google-auth-library';
import jwt from "jsonwebtoken"


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)


const genereateAccessAndRefreshToken =async (userId)=>{
    try {
        const user = await User.findById(userId)

        const accessToken= user.genereateAccessToken()

        const refreshToken=user.genereateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave:false})

        return {accessToken ,refreshToken}

    } catch (error) {
        throw new ApiError(500 , "Something went wron while generating refersh and access token")   
    }
}

const registerUser = asyncHandler(async (req, res)=>{
    
     const { username,email ,password } = req.body
    
    

    if( 
        [username , email , password].some((field) =>field?.trim() ==="")
    ){
        throw new  ApiError(400,"All Fields required");
    }

    const existedUser = await User.findOne({
        $or:[{username} , {email}]
    })

    if(existedUser){
        throw new ApiError(409 , "User with email or username already exists!!")
    }

    const user = await User.create({
       
        username:username.toLowerCase(),
        email,
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500 , "Something went Wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser,"User registered Successfully")
    )

})

const googleLogin = asyncHandler(async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    throw new ApiError(400, "Missing Google credential");
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, name, picture } = payload;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      username: name,
      email,
      avatar: picture,
      password: 'GOOGLE_AUTH',
    });
  }

  const { accessToken, refreshToken } = await genereateAccessAndRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

  const options = {
    httpOnly: true,
    secure: true, // true in production (https)
    sameSite: 'None', // Required for cross-origin cookies
  };

  return res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
      }, "Google login successful")
    );
});

const loginUser = asyncHandler(async(req, res)=>{
    //req body ->data
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookie
    //res

    const {email , username , password} = req.body;

    if(!email && !username){
        throw new ApiError(400,"username or email required");
    }
    const user = await User.findOne({
        $or:[{email} , {username}]
    })

    if(!user){
        throw new ApiError(404,"user does not exists!")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user Credentials")
    }

       const {accessToken , refreshToken}=await genereateAccessAndRefreshToken(user._id)

       const loggedInUser = await  User.findById(user._id).select("-password -refreshToken" )


       const options ={
            httpOnly:true,
            secure:true
       }
       return res.
       status(200).cookie("accessToken" ,accessToken ,options).
       cookie("refreshToken" , refreshToken , options).
       json(
        new ApiResponse(200,{
            user:loggedInUser,accessToken,refreshToken
        },
        "User logged In Successfully"
    )
       )

})




const logoutUser = asyncHandler(async(req , res)=>{
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken :undefined
            }
        },{
            new:true
        }
    )
    const options ={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(
        new ApiResponse(200 ,{} , "User logged Out")
    )

})


const refershAccessToken = asyncHandler(async(req , res)=>{
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
        throw new ApiError(401 , "unauthorized request")
   }
  try {
     const decodedToken =jwt.verify(incomingRefreshToken , process.env.REFRESH_TOKEN_SECRET)
  
   const user = await  User.findById(decodedToken._id)
  
    if(!user){
          throw new ApiError(401 , " Inavlid refresh token")
     }
  
     if(incomingRefreshToken !== user?.refreshToken){
          throw new ApiError(401 ,"Refresh token is expired or used")
     }
  
          const options={
              httpOnly:true,
              secure:true
          }
  
       const {accessToken,newRefreshToken}=  await genereateAccessAndRefreshToken(user._id)
  
         return res
         .status(200)
         .cookie("accessToken" ,accessToken,options)
         .cookie("refreshToken",newRefreshToken,options)
         .json(
           new ApiResponse(
              200,
              {accessToken ,refreshToken:newRefreshToken},
              "Access Token Refreshed"
           )
         )
  } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Refresh Token")
  }
})


const changePassword = asyncHandler(async(req , res)=>{
    const {oldPassword , newPassword} = req.body;

    if(!oldPassword || !newPassword){
        throw new ApiError(400 , "All fields are required");
    }

    if(oldPassword === newPassword){
        throw new ApiError(400, "Cannot change the same old password");
    }

    if(newPassword.length < 6){
        throw new ApiError(400 , "Password must be at least 8 characters long");
    }

    const user = await User.findById(req.user._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(401 , "Invalid old password");
    }

    user.password = newPassword;

    await user.save({validateBeforeSave:false});

    return res.status(200).json(
        new ApiResponse(200 , {} , "Password Changed Successfully")
    )


})





export {
    registerUser,
    loginUser,
    logoutUser,
    refershAccessToken,
    changePassword,
    googleLogin

}