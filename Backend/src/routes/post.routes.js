import { Router } from "express";
import { addCommentToPost, createPost, deleteCommentToPost, deletePost, getAllPosts, getMyPosts, getSinglePost, toggleLikePost, updatePost } from "../controllers/post.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router()

//public routes
router.route("/getAllPosts").get(getAllPosts)
router.route("/:id").get(getSinglePost)

//secured routes
router.route("create-post").post(verifyJWT , createPost)
router.route("/user/myposts").get(verifyJWT , getMyPosts)
router.route("/:id").put(verifyJWT ,updatePost)
router.route("/:id").delete(verifyJWT ,deletePost)

//likes
router.route("/:id/like").post(verifyJWT , toggleLikePost);

//comments
router.route("/:id/comment").post(verifyJWT , addCommentToPost)
router.route("/:postId/comment/:commentId").delete(verifyJWT , deleteCommentToPost)

export  default router