const router=require('express').Router()
const shorted=require("shortid")
const userModel=require("../../../models/user")
const urlModel=require("../../../models/url")
const jwt= require('jsonwebtoken')
const isUrl=require("is-url")
const urlCheck=require("valid-url")
const user = require('../../../models/user')



router.post("/urlLink",async(req,res)=>{
    try {
        const {input,token}=await req.body
        const {userId}=await jwt.verify(token,process.env.SECRETE_KEY);
        if(!userId){
            return res.status(400).json({msg:"Token not valid"})
        }
////////////////////// url already here are not--check is code---/////////////////////////////////////
        const shortUrl=await urlModel.findOne({originalUrl:input}).select("shortedUrl -_id")
        if(shortUrl){
            return res.json({msg:shortUrl,used:'Already One User Created this Link '})
        }
        else{
            const baseUrl='https://url-shortner5.herokuapp.com';
            const shortId=shorted.generate();
            const shortUrl=baseUrl+"/"+shortId;
            const newUrl=new urlModel(
                {
                    originalUrl:input,
                    shortedId:shortId,
                    shortedUrl:shortUrl,
                })
            const savedUrl=await newUrl.save()
            const userAccount=await userModel
            .findByIdAndUpdate(
                {_id:userId},
                {$push:{urlData:savedUrl._id}},
                {new:true}
                )
            res.json({msg:savedUrl})
        }   
    } catch (error) {
        console.log(error);
    }
})

router.post("/dashboard",async(req,res)=>{
    try {
        const {userId}=await jwt.verify(req.body.token,process.env.SECRETE_KEY);
        if(!userId){
            res.status(400).json({status:false})
        }
        const userData=await userModel.findById({_id:userId});
        if(!userData){
            res.status(400).json({status:false})
        }
        const userUrls=await urlModel.find({_id:userData.urlData})
        .select('-_id originalUrl shortedUrl date clicked')
        if(!userUrls){
            res.status(400).json({status:false})
        }
        res.json({status:true,urlData:userUrls})
    } catch (error) {
        console.log(error);
    }
})
module.exports=router
