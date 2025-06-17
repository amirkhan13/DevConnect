import express from "express"
import cors from "cors"
import cookieParser  from "cookie-parser"

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials : true

}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import  userRouter from './routes/user.routes.js'


//routes declaration
app.use("/api/v1/users" , userRouter) //since in app.get() we were writing controller ,routes at same place, we didn't have to user 
// middleware there but here we have to..



export {app}