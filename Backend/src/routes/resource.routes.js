import { Router } from "express";
import { addResource, deleteResource, getAllResource, getMyResources, getResourcesByCategory } from "../controllers/resource.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

//public routes

router.route("/").get(getAllResource)
router.route("category/:category").get(getResourcesByCategory)

//secured routes
router.route("/add-resource").post(verifyJWT,addResource)
router.route("/myresources").get(verifyJWT,getMyResources)
router.route("/delete-resource").delete(verifyJWT,deleteResource)





export default router