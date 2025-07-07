import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { followUser, getFollowers, getFollowing, getFollowStats, isFollowing, unfollowUser } from "../controllers/folllow.controller.js";

const router = Router()

router.route("/follow").post(verifyJWT ,followUser);
router.route("/unfollow").post(verifyJWT ,unfollowUser);
router.route("/followers/:userId").get(verifyJWT ,getFollowers);
router.route("/following/:userId").get(verifyJWT ,getFollowing);
router.route("/stats/:userId").get(verifyJWT ,getFollowStats);
router.route("/is-following/:targetUserId").get(verifyJWT ,isFollowing);



export default router