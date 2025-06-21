import { Router } from "express";
import { changePassword, loginUser, logoutUser, refershAccessToken, registerUser } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refershAccessToken)
router.route("/change-password").patch(verifyJWT , changePassword)

export default router