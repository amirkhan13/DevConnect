import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema({

    title:{
        type:String,
        required : true
    },

    description:{
        tyoe:String,
        required:true
    },
    techstack:[
        {

            type:String,
            required:true
        }
    ],
    githubLink:{
        type:String,
        
    },
    thumbnail:{
        type:String
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    likes:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
    collaborators:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }


},{timestamps: true})


export const Project = mongoose.model("Project" , projectSchema)