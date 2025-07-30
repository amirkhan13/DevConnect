import { Router } from "express";
import { changePassword, googleLogin, loginUser, logoutUser, refershAccessToken, registerUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteUserAccount, getCurrentUser, getUserByUsername, updateUserAvatar, updateUserCoverImage, updateUserProfile } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/google-login").post(googleLogin)
router.route("/me").get(verifyJWT, getCurrentUser)
router.route("/:username").get(getUserByUsername)

// secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refershAccessToken)
router.route("/change-password").patch(verifyJWT , changePassword)
router.route("/update-profile").put(verifyJWT , updateUserProfile)
router.route("/upload-avatar").put(verifyJWT ,upload.single("avatar"),updateUserAvatar);
router.route("/upload-coverImage").put(verifyJWT ,upload.single("coverImage"),updateUserCoverImage);
router.route("/delete").delete(verifyJWT ,deleteUserAccount);




export default router