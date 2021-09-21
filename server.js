const express=require('express')
const app=express()
const cors=require('cors')
app.use(cors())
app.use(express.json())
const router=require("./router")
const db=require("./config/db")
const dotenv=require('dotenv')
dotenv.config({path:"./config/config.env"})
db();
const redirect=require("./router/api/redirect")


app.get("/",(req,res)=>{
    res.json("it is working")
})
app.use("/api",router)
app.use("/",redirect)

app.listen(process.env.PORT||5000,()=>{
    console.log("server started");
})