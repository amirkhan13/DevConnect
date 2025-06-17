import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({

    sender:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    receiver:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    message:{
        type:String,
        
    }
},{timestamps:true})

export const Message = mongoose.model("Message" , messageSchema)