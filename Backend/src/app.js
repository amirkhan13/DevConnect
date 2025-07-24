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
import userRouter from './routes/user.routes.js'
import projectRouter from './routes/project.routes.js'
import postRouter from './routes/post.routes.js'
import resourceRouter from "./routes/resource.routes.js"
import messageRouter from "./routes/message.routes.js"
import followRouter from  "./routes/follow.routes.js"



//routes declaration
app.use("/api/v1/users" , userRouter) //since in app.get() we were writing controller ,routes at same place, we didn't have to use
// middleware there but here we have to..

app.use("/api/v1/projects" , projectRouter)

app.use("/api/v1/posts" ,postRouter)

app.use("/api/v1/resources" ,resourceRouter)

app.use("/api/v1/messages" ,messageRouter)

app.use("/api/v1/followers" , followRouter)




export {app}