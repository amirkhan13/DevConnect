import { Router } from "express";
import { deleteMessage, getMessages, getRecentConversations, markMessagesAsRead } from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/conversation/:userId").get(verifyJWT,getMessages)
router.route("/recent").get(verifyJWT,getRecentConversations)
router.route("/mark-read/:userId").patch(verifyJWT,markMessagesAsRead)
router.route("/:messageId").delete(verifyJWT,deleteMessage)


export default router