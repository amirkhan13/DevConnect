import {Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createPost = asyncHandler(async(req , res)=>{
    //get the data req.body
    //check if empty or not
    //create the post
    //retrun res

    const {content , tags =[] } = req.body

    if(!content || content.trim() === "" ){
        throw new ApiError(400 ,"Post content is required")
    }

    if (!Array.isArray(tags)) {
    throw new ApiError(400, "Tags must be an array");
  }

    const newPost = await Post.create({
        content,
        tags,
        author:req.user._id,
    })


    return res.status(201)
    .json(
        new ApiResponse(201 , newPost ,"Post created successfully")
    )
})

const getAllPosts = asyncHandler(async(req ,res)=>{
    const posts = await Post.find({})
    .populate("author" , "username avatar fullName")
    .populate("comments.user" , "username avatar")
    .sort({createdAt : -1 })

    return res.status(200)
    .json(
        new ApiResponse(200 , posts , "All posts fetched successfully")
    )
})

const getSinglePost = asyncHandler(async(req , res)=>{
        const {id} = req.params
        
        const post = await Post.findById(id)
        .populate("author" , "username avatar fullName")
        .populate("comments.user" , "username avatar")

        if(!post){
            throw new ApiError(404 , "post doesn't exists")
        }

        return res.status(200)
        .json(
            new ApiResponse(200, post , "post fetched succesfully")
        )
})

const getMyPosts = asyncHandler(async(req , res)=>{
    const post = await Post.find({author:req.user._id})
    .populate("author", "username avatar fullName")
    .populate("comments.user", "username avatar")
    .sort({createdAt:-1})

    if(!post){
        throw new ApiError(404, "Post not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(200,post ,"Post fetched successfully")
    )
})

const updatePost = asyncHandler(async(req, res)=>{
    //req.body
    //check if empty
    //check if the same user updating it
    //save
    //return res

    const {id} = req.params

    const post = await Post.findById(id);

    if(!post){
        throw new ApiError(404 , "Post not found")
    }

    if(post.author.toString() !== req.user._id.toString()){
        throw new ApiError(403,"You're not authorized to update this post")
    }

    const {content , tags} = req.body

    if(content !== undefined)post.content = content

    if(tags !== undefined)post.tags = tags;

    await post.save();

    return res.status(200)
    .json(
        new ApiResponse(200, post ,"Post updated successfully")
    )
})

const deletePost = asyncHandler(async(req, res)=>{

        const {id} = req.params;
        const post = await Post.findById(id);

        if(!post){
            throw new ApiError(404,"Post not found")
        }

        if(post.author.toString() !== req.user._id.toString()){
            throw new ApiError(403,"You're not authorized to delete this post")
        }

        await post.deleteOne();

        return res.status(200)
        .json(
            new ApiResponse(200 , {} , "Post deleted Successfully")
        )
})


const toggleLikePost = asyncHandler(async(req, res)=>{
    const {id} = req.params
    const post = await Post.findById(id);

    if(!post){
        throw new ApiError(404 , "Post not found")
    }
    const userId = req.user._id
    const isLiked = post.likes.includes(userId);

    if(isLiked){
        post.likes.pull(userId)
    }else{
        post.likes.push(userId)
    }
    await post.save();

    return res.status(200)
    .json(
        new ApiResponse(200,
            {
                postId:post._id,
                totalLikes:post.likes.length,
                liked:!isLiked,
            },
            isLiked ? "Post unliked" : "Post liked"

        )
    )
})

const addCommentToPost = asyncHandler(async(req , res)=>{
    const {id} = req.params;
    const {text} = req.body;

    if(!text || text.trim() === ""){
        throw new ApiError(400,"comment text is required");
    }

    const post = await Post.findById(id);

    if(!post) throw new ApiError(404,"Post not found");

    post.comments.push({
        user:req.user._id,
        text:text.trim()
    })

    await post.save();

    
  const lastComment = post.comments[post.comments.length - 1];

    return res.status(200)
    .json(
        new ApiResponse(200 , lastComment , "Comment added Successfully")
    )
})

const deleteCommentToPost = asyncHandler(async(req, res)=>{

        const {postId , commentId} = req.params;

        const post = await Post.findById(postId);
        
        if(!post) throw new ApiError(404, "Post not found");

        const comment = post.comments.id(commentId)

        if(!comment) throw new ApiError(404, "Comment not found");

        const isCommentOwner =comment.user.toString() === req.user._id.toString();
        const isPostOwner = post.author.toString() === req.user._id.toString();

        if(!isCommentOwner && !isPostOwner){
            throw new ApiError(400 ,"You are not authorized to delete this comment")
        }

        await comment.deleteOne();

        await post.save();

        return res
        .status(200)
        .json(new ApiResponse(200, {commentId}, "Comment deleted successfully"));


})

export{
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    getMyPosts,
    deletePost,
    toggleLikePost,
    addCommentToPost,
    deleteCommentToPost





}