import mongoose, { Schema }  from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({

    username: {
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    fullName: {
        type:String,
      
        
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
    },
    coverImage:{
        type:String
    },
    bio:{
        type:String
    },
    skills: [String],

    github:{
        type:String
    },
    linkedin:{
        type:String
    },
    website:{
        type:String
    },
    refreshToken:{
        type:String
    }

} ,{timestamps:true})


userSchema.pre("save" ,async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect =async function(password){
   return await bcrypt.compare(password , this.password)
} 


userSchema.methods.genereateAccessToken = function(){
    return jwt.sign({
        _id: this._id,
        email:this.email,
        username:this.username,
        fullName:this.fullName

    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY 
    }
)
}
userSchema.methods.genereateRefreshToken = function(){
return jwt.sign({
        _id: this._id,
        

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY 
    }
)
}

export const User =mongoose.model("User" , userSchema);