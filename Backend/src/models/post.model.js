import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    content:{
        type:String,
        required:true,
    },
    author:{
        type:Schema.Types.ObjectId,
        ref: "User",
    },
    tags:{
        type:String,

    },
    likes:[{
        type:Schema.Types.ObjectId,
        ref:"User",
    }],
    comments:[{
        user:Schema.Types.ObjectId,
        ref:"User",
        text: String
    }]


},{timestamps:true})


export const Post = mongoose.model("Post" , postSchema)