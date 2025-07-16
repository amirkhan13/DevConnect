import { Resource } from "../models/resource.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addResource = asyncHandler(async(req ,res)=>{
     const {title , link , category} = req.body

     if(!title || !link || !category)
     {
        throw new ApiError(400 ,"All fields are required")
     }

     const resource = await Resource.create({
        title,
        link,
        category,
        addedBy:req.user._id
     })

     return res.status(201)
     .json(
           new  ApiResponse(201 , resource , "resource created ")
     )
})

const getAllResource = asyncHandler(async(req , res)=>{

        const resources = await Resource.find()
        .populate("addedBy" , "username avatar")
        .sort({createdAt : -1});

        return res.status(200)
        .json(
            new ApiResponse(200 , resources , "resources fetched")
        )
})

const getResourcesByCategory = asyncHandler(async(req , res)=>{
    const {category} = req.params;

    if(!category) throw new ApiError(404, "category not found")

    const resources = await Resource.find({ category: category.toLowerCase() });

  return res.status(200).json(new ApiResponse(200, resources, "Resources by category fetched"))
})

const deleteResource = asyncHandler(async(req , res)=>{

        const {id} = req.params

        const resource = await Resource.findById(id);

        if(!resource) throw new ApiError(404 , "resource not found")

         if(resource.addedBy.toString() !== req.user._id.toString()){
            throw new ApiError(403, "Your are not authorized to delete this resource")
         }   

        await Resource.findByIdAndDelete(id);

        return res.status(200)
        .json(
            new ApiResponse(200, {} , "resource deleted successfully")
        )

})

const getMyResources = asyncHandler(async(req ,res)=>{
    
    const resources = await Resource.find({addedBy: req.user._id})
    .sort({createdAt:-1});

    return res.status(200).json(
    new ApiResponse(200, resources, "Your resources fetched successfully")
  );
})

export{
addResource,
getAllResource,
getResourcesByCategory,
deleteResource,
getMyResources

}