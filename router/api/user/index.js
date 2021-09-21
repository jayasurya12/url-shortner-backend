const router=require('express').Router();
const jwt =require("jsonwebtoken")
const bcrypt=require("bcrypt")
const userModel=require("../../../models/user")
const nodemailer=require('nodemailer')
const auth=require('../../../library/auth')

router.post('/userSignup',async (req,res)=>{
    try {
        const emailAddress=req.body.email;
        const emailVerify=await userModel.findOne({email:emailAddress})
        if(emailVerify){
            if(!emailVerify.verified){
                return res.status(400).json("This Email Address Account has been already created but not Verified go and Check")
            }
            return res.status(400).json('This Email Address already created')
        }
        const pass= await bcrypt.hash(req.body.newPassword,10)
        req.body.newPassword=pass;
        const user=await userModel({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            email:req.body.email,
            password:req.body.newPassword
        });
        const data=await user.save();
///////////////////////////////////////////////------------token-------------------------///////////////////////
        const token=await jwt.sign({userId:data._id},process.env.SECRETE_KEY)
///////////////////////-token-------////////////////////////////////////////////////////////////////////////////       
        const emailVerification=nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:587,
            service:'gmail',
            secure:true,
            auth:{
                user:process.env.EMAIL_ID,
                pass:process.env.EMAIL_PASS
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        })
        const send=await emailVerification.sendMail({
            form:process.env.EMAIL_ID,
            to:user.email,
            subject:"Hi this is verification process!!!",
            html:`<div>
                <h3>Hi this is url-shortner account created  verify link is below</h3>
                <a href='https://url-shortner-3.herokuapp.com/verify/${token}'>click here</a>
            </div>`        
        })
        if(!send){
            console.log(send);
            res.status(400).json("Something error")
        }
        res.status(200).json("Account Successfully Created verification Message Send Your email")
    } catch (error) {
        res.json(error)
    }
})
//////////////////////-----this route use login verification process----////////////////////////////////////////////
router.post("/login",async(req,res)=>{
    try {
        const {email,password}=await req.body
        const userEmail= await userModel.findOne({email:email});
        if(!userEmail){
            return res.status(400).json("User not found")
        }
        if(!userEmail.verified){
            return res.status(400).json('Account not Verified')
        }
        const match=await bcrypt.compare(password,userEmail.password)
        if(match){
            const token=await jwt.sign({userId:userEmail._id},process.env.SECRETE_KEY);
            return res.status(200).json({token:token})
        }
        else{
            return res.status(400).json("Wrong Password")
        }
    } catch (error) {
        res.status(400).json('Some error')
    }
})
///////////////////////-------------/////////////////////
router.post('/userPage',async(req,res)=>{
    try {
        const {token}=req.body;
        const {userId}=await jwt.verify(token, process.env.SECRETE_KEY)
        if(!userId){
            return res.status(404).json({msg:"Token Error"})
        }
        const userData=await userModel.findById({_id:userId})
        .select("-newPassword -verified -confirmPassword -__v -_id -urlData")
        res.status(200).json({status:true,user:userData})

    } catch (error) {
        res.status(400).json(error)
    }
})
//////--------llllllllllll///////////////////////////////////
router.get('/data',auth,async(req,res)=>{
    try {
        const userData= await userModel.findById({_id:req.userId})
        .select("firstName lastName email -_id")
        if(userData){
            return res.json(userData) 
        }else{
            res.status(400).json('bad request')
        }
         
    } catch (error) {
        res.status(400).json("Access Denide")
    }
})
///////////////this route used by verificaition msg send ---user email  user to click that msg open this route and verify--------///////
router.get("/verify",async(req,res)=>{
    try { 
       
        const token=req.headers["authorization"]
        const id= await jwt.verify(token,process.env.SECRETE_KEY)
        
        const verify=await userModel.findByIdAndUpdate(
            {_id:id.userId},
            {verified:true}
        )
        res.json({msg:'Account verification success. Now you can Login'})
    } catch (error) {
        res.json({msg:"Sorry the account verification failed"})
    }
})
/////////////////--------------------profile-----/////////////////////////////////////
router.post("/profile",async(req,res)=>{
    try {
        const {token}=req.body;
        const {userId}=await jwt.verify(token, process.env.SECRETE_KEY);
        const userData= await userModel.findById({_id:userId})
        .select("-_id firstName lastName email date urlData")
        res.json({msg:userData})
    } catch (error) {
        console.log(error)
    }
})


module.exports=router