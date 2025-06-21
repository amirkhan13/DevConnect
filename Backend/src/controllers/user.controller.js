import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";



const getCurrentUser = asyncHandler(async(req, res)=>{
   return res.status(200).json({
      user: req.user,
      message: " User fetched successfully"
   });
})

const getUserByUsername = asyncHandler(async(req , res)=>{
    const {username} = req.params;
    if(!username?.trim()){
        throw new ApiError(400,"username is required");
    }

     const user = await User.findOne({ username: username.toLowerCase() }).select(
    "username fullName avatar coverImage bio skills github linkedin website createdAt"
  );

    if(!user){
        throw new ApiError(404 , "user doesn't exists");
    }

    return res.status(200)
    .json(
        new ApiResponse(200 , user , "public profile fetched successfully")
    );
})

const updateUserProfile = asyncHandler(async(req , res)=>{
    const {fullName , bio , skills ,github ,linkedin , website } = req.body;

    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiError(404, "User not found");
    }

    if(fullName) user.fullName = fullName;
    if(bio) user.bio = bio;
    if(skills && Array.isArray(skills)) user.skills = skills;
    if(github) user.github = github;
    if(linkedin) user.linkedin = linkedin;
    if(website) user.website = website;
    


    await user.save({validateBeforeSave:false});


    const updatedUser = await User.findById(user._id).select("-password -refreshToken");
    
    

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "User profile updated successfully")
    );




    
})

const updateUserAvatar = asyncHandler(async(req , res)=>{
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar image is required");
    }

       const avatar= await uploadOnCloudinary(avatarLocalPath);  

       if(!avatar.url){
        throw new ApiError(400, "Error while uploading avatar image");
       }

       const user = await User.findByIdAndUpdate(
         req.user._id,
         {
            $set:{
                avatar : avatar.url
            }
         },
         {
            new : true
         }
       ).select("-password");



       return res.status(200)
       .json(
          new ApiResponse(200 , user , "Avatar image update successfully")
       )

})


const updateUserCoverImage = asyncHandler(async(req , res)=>{
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
        throw new ApiError(400, "Cover image is required");
    }

       const coverImage= await uploadOnCloudinary(coverImageLocalPath);  

       if(!coverImage.url){
        throw new ApiError(400, "Error while uploading cover image");
       }

       const user = await User.findByIdAndUpdate(
         req.user._id,
         {
            $set:{
                coverImage : coverImage.url
            }
         },
         {
            new : true
         }
       ).select("-password");



       return res.status(200)
       .json(
          new ApiResponse(200 , user , "Cover image update successfully")
       )

})

const deleteUserAccount = asyncHandler(async(req , res)=>{
    //req.user._id
    //ask for the password
    //if match delete the user
    //clear the cookies and refresh token and access token

    const user = await User.findById(req.user._id);
    
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const {password} = req.body;
    if(!password){
        throw new ApiError(400, "Password is required to delete account");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password");
    }

    const deletedUser = await User.findByIdAndDelete(req.user._id);

    if(!deletedUser){
        throw new ApiError(500, "Error while deleting user account");
    }

      const options ={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(
        new ApiResponse(200 , {} , "account deleted Successfully")
    )
    



})



export {
    getCurrentUser,
    updateUserProfile,
    updateUserAvatar,
    updateUserCoverImage,
    deleteUserAccount,
    getUserByUsername
}