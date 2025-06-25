import { Project } from "../models/project.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";




const createProject = asyncHandler(async(req  ,res)=>{
        // get the data 
        //check the required fileds
        // create the project
        // send res

        const {title ,description,techstack,githubLink,collaborators=[]} = req.body

         if (
            [title, description, githubLink].some(field => typeof field !== 'string' || field.trim() === "") ||
            !Array.isArray(techstack) ||
            !Array.isArray(collaborators)
           ) {
            throw new ApiError(400, "Invalid or missing fields.");
             }

            const thumbnailLocalPath = req?.file.path;

            if(!thumbnailLocalPath){
                throw new ApiError(400,"thumbnail is required");
            }

            const thumbnailURL = await uploadOnCloudinary(thumbnailLocalPath);

            if(!thumbnailURL.url){
               throw new ApiError(400, "Error while uploading thumbnail image");
            }


        const newProject = await Project.create({
            title,
            description,
            techstack,
            githubLink,
            thumbnail:thumbnailURL.url,
            createdBy:req.user._id,
            collaborators,
        })


        return res.status(201)
        .json(
            new ApiResponse(201 , newProject , "project created successfully")
        )
    })

const getAllProjects = asyncHandler(async(req , res)=>{
    const projects = await Project.find({})
    .populate("createdBy" , "username avatar")
    .populate("collaborators" , "username avatar ")
    .sort({createdAt : -1});

    return res.status(200)
    .json(
        new ApiResponse(200 , projects ,"Projects fetched successfully")
    )
    
})

const getMyProject = asyncHandler(async(req , res)=>{
        const project = await Project.find({createdBy: req.user._id})
        .populate("createdBy" , "username avatar fullName")
        .populate("collaborators" , "username avatar ")
        .sort({createdAt : -1})

        if(!project){
            throw new ApiError(400 , "Project not found")
        }


        return res.status(200)
        .json(
            new ApiResponse(200 , project,"Your project fetched successfully")
        )


})

const updateProject = asyncHandler(async(req , res)=>{
        //fetch project id 
        //check if exist
        //check if the same user is changing it
        //update fields
        //return res

        const {id} = req.params

        const project = await Project.findById(id);

        if(!project){
            throw new ApiError(404,"project not found");
        }

        if(project.createdBy.toString() !== req.user._id.toString()){
            throw new ApiError(403 , "Your are not authorized to update this project")
        }

        const updateableFields =
            [
                "title",
                 "description",
                "techstack",
                "githubLink",
                "collaborators",
            ];

            updateableFields.forEach((field)=>{
                if(req.body[field] !== undefined){
                    project[field] = req.body[field]
                }
            })  
            
            if (req.file?.path) {
                const cloudinaryResult = await uploadOnCloudinary(req.file.path);

                if (!cloudinaryResult?.url) {
                throw new ApiError(400, "Failed to upload new thumbnail");
                }

                project.thumbnail = cloudinaryResult.url;
            }

            await project.save();


            return res.status(200)
            .json(
                 new ApiResponse(200 , project ,"Project updated successfully")
            )
        
})

const deleteProject =asyncHandler(async(req , res)=>{

    const {id} = req.params

    const project = await Project.findById(id);

    if(!project){
        throw new ApiError(404 , "project not found");
    }

    if(project.createdBy.toString() !== req.user._id.toString()){
        throw new ApiError(403 , "You're not authorized to delete this project")
    }

     await Project.findByIdAndDelete(id);


     return res.status(200)
     .json(
            new ApiResponse(200 , {} , "Project deleted successfully")  
     )
})


const getSingleProject = asyncHandler(async(req , res)=>{
    const {id} = req.params

    const project = await Project.findById(id)
    .populate("createdBy" , "username avatar fullName")
    .populate("collaborators" , "username avatar ");

    if(!project){
        throw new ApiError(404, "Project not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200 , project , "Project fetched successfully")
    )

   
})

const toggleLikeProject = asyncHandler(async(req , res)=>{
    const {id} = req.params

    const project = await Project.findById(id);


    if(!project){
        throw new ApiError(404 , "Project not found");
    }

    const userId = req.user._id;
    const isLiked = project.likes.includes(userId);

    if(isLiked){
        project.likes.pull(userId);
    }else{
        
        project.likes.push(userId);
    }

    await project.save();


    return res.status(200)
    .json(
       new ApiResponse(
         200 , {
            projectId : project._id,
            totalLikes : project.likes.length,
            liked: !isLiked,
        }, isLiked ? "Projec unlinked" : "Project linked"
       )
    )
})

const getProjectByUser = asyncHandler(async(req , res)=>{
    const {userId} = req.params

    const projects = await Project.find({createdBy: userId})
    .populate("createdBy" , "username avatar fullName")
    .populate("collaborators" , "username avatar ")
    .sort({createdAt : -1})


    if(!projects){
        throw new ApiError(404 , "no projects found for this user")
    }

    return res.status(200)
    .json(
        new ApiResponse(200 , projects , "Projects fetched successfully")
    )
})






export {
        createProject,
        getAllProjects,
        getMyProject,
        updateProject,
        deleteProject,
        getSingleProject,
        toggleLikeProject,
        getProjectByUser
    }