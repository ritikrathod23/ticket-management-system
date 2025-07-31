import express from "express"
import authRoute from "./routes/authRoute.js"
import adminRoute from "./routes/adminRoute.js"
import  ticketRoute from './routes/ticketRoute.js'
import mongooseConnect from "./mongooseConfig.js/config.js"
import cookieParser from "cookie-parser"

const port = process.env.PORT


const app = express()

//middlewares 
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())


//route
app.use("/auth", authRoute  )
app.use("/", ticketRoute )
app.use("/admin", adminRoute )

mongooseConnect()
app.listen(port, ()=>{
    console.log("server started")
})