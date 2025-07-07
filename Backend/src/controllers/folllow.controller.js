import mongoose from "mongoose";
import { Follow } from "../models/follow.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



const followUser = asyncHandler(async (req, res) => {
  const { targetUserId } = req.body;
  const currentUserId = req.user._id;

  if (!targetUserId) {
    throw new ApiError(400, "Target user ID is required");
  }

  if (currentUserId.toString() === targetUserId.toString()) {
    throw new ApiError(400, "You can't follow yourself.");
  }

  const alreadyFollowing = await Follow.findOne({
    follower: currentUserId,
    following: targetUserId,
  });

  if (alreadyFollowing) {
    throw new ApiError(400, "You're already following this user");
  }

  await Follow.create({
    follower: currentUserId,
    following: targetUserId,
  });

  return res.status(200).json(
    new ApiResponse(200, { targetUserId }, "Followed successfully")
  );
});

const unfollowUser = asyncHandler(async(req , res)=>{
    const {targetUserId} = req.body
    const currentUserId = req.user._id;

    if(!targetUserId){
        throw new ApiError(400 , "target user ID is required");
    }

    const result  = await Follow.findOneAndDelete({
        follower:currentUserId,
        following:targetUserId
    })
    if(!result){
        throw new ApiError(400,"You are not following this user")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, {targetUserId} , "Unfollowed the user ")
    )
})

const getFollowers = asyncHandler(async(req, res)=>{
    const {userId} = req.params;

    const followers = await Follow.aggregate([
        {
            $match:{
                following: new mongoose.Types.ObjectId(userId) 
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"follower",
                foreignField:"_id",
                as:"followerInfo"
            }
        },
        {
            $unwind:"$followerInfo"
        },
        {
      $project: {
        _id: 0,
        followerId: "$followerInfo._id",
        username: "$followerInfo.username",
        name: "$followerInfo.name",
        avatar: "$followerInfo.avatar",
      },
    },
    ])

    return res.status(200)
    .json(
        new ApiResponse(200 ,{count:followers.length , followers})
    )
})

const getFollowing = asyncHandler(async(req , res)=>{
    const {userId} = req.params

    const following = await Follow.aggregate([
        {
            $match:{
                follower: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from : "users",
                localField:"following",
                foreignField:"_id",
                as:"followingInfo"
            }
        },
        {$unwind:"$followingInfo"},
         {
      $project: {
        _id: 0,
        followingId: "$followingInfo._id",
        username: "$followingInfo.username",
        name: "$followingInfo.name",
        email: "$followingInfo.email",
        avatar: "$followingInfo.avatar",
      },
    },
    ])

    return res.status(200)
    .json(
        new ApiResponse(200 , {count:following.length , following})
    )
})

const getFollowStats = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const [followerAgg, followingAgg] = await Promise.all([
    Follow.aggregate([
      { $match: { following: new mongoose.Types.ObjectId(userId) } },
      { $count: "followerCount" },
    ]),
    Follow.aggregate([
      { $match: { follower: new mongoose.Types.ObjectId(userId) } },
      { $count: "followingCount" },
    ]),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      followerCount: followerAgg[0]?.followerCount || 0,
      followingCount: followingAgg[0]?.followingCount || 0,
    })
  );
});

const isFollowing = asyncHandler(async (req, res) => {
  const { targetUserId } = req.params;
  const currentUserId = req.user._id;

  const match = await Follow.aggregate([
    {
      $match: {
        follower: new mongoose.Types.ObjectId(currentUserId),
        following: new mongoose.Types.ObjectId(targetUserId),
      },
    },
    { $limit: 1 },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, { isFollowing: match.length > 0 }));
});



export{
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowStats,
    isFollowing


}