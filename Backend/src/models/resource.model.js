import mongoose, { Schema } from "mongoose";


const resourceSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    link:{
        type:String,
        required: true
    },
    category:{
        type:String,
        
    },
    addedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})

export const Resource =mongoose.model("Resource" , resourceSchema)