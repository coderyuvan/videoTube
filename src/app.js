import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
const app=express();

// configure cors now
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))
// handeling data coming from json 
app.use(express.json({
    limit:"20kb"
}))

// handeling data coming from url
app.use(express.urlencoded({
    extended:true,
    limit:"20kb"}))

// koi image favicon aaye to pulic folder m rklo for future use
app.use(express.static("public"))

// configure cookies now
app.use(cookieParser())


// routes import 
import userRouter from './routes/user.routes.js'


//routes declaratrion
app.use("/api/v1/users",userRouter)
// /user k baad control route p pass hoga
// http://localhost:8000/users is prefix then /register and so on will get added to url
export {app}