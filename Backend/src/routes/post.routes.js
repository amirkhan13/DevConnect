import { Router } from "express";
import { addCommentToPost, createPost, deleteCommentToPost, deletePost, getAllPosts, getMyPosts, getSinglePost, toggleLikePost, updatePost } from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

//public routes
router.route("/getAllPosts").get(getAllPosts)
router.route("/:id").get(getSinglePost)

//secured routes
router.post("/create-post", verifyJWT,upload.single("image"), createPost);

router.route("/user/myposts").get(verifyJWT , getMyPosts)
router.route("/:id").put(verifyJWT , upload.single("image"),updatePost)
router.route("/:id").delete(verifyJWT ,deletePost)

//likes
router.route("/:id/like").post(verifyJWT , toggleLikePost);

//comments
router.route("/:id/comment").post(verifyJWT , addCommentToPost)
router.route("/:postId/comment/:commentId").delete(verifyJWT , deleteCommentToPost)

export  default router