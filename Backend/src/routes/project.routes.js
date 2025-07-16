import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createProject, deleteProject, getAllProjects, getMyProject, getProjectByUser, getSingleProject, toggleLikeProject, updateProject } from "../controllers/project.controller.js";



const router = Router()

router.route("/getAllProjects").get(getAllProjects);
router.route("/me").get(verifyJWT,getMyProject);
router.route("/user/:id").get(getProjectByUser);
router.route("/:id").get(getSingleProject)
//secured routes
router.route("/create-project").post(verifyJWT ,upload.single("thumbnail"),createProject);
router.route("/:id").put(verifyJWT , upload.single("thumbnail"),updateProject);
router.route("/:id").delete(verifyJWT ,deleteProject);
router.route("/:id/like").put(verifyJWT,toggleLikeProject)





export default router