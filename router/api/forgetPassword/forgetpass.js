const router=require('express').Router()
const userModel=require("../../../models/user")
const nodemailer=require("nodemailer")
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')

router.post('/userPassVerify',async(req,res)=>{
    try {
        const userDataModel=await userModel.findOne({email:req.body.email})
        if(userDataModel){
            if(userDataModel.verified){
                const token=await jwt.sign({userId:userDataModel._id},process.env.SECRETE_KEY,{expiresIn:'15min'})
                const transport=await nodemailer.createTransport({
                    host:'smtp.gmail.com',
                    port:587,
                    service:"gmail",
                    secure:true,
                    auth:{
                        user:process.env.EMAIL_ID,
                        pass:process.env.EMAIL_PASS
                    }
                })
                const info=await transport.sendMail({
                    from:process.env.EMAIL_ID,
                    to:userDataModel.email,
                    subject:"url-shortner forget password link",
                    html:`<div>
                        <h3>Hi this is password reset verification link this link 15min work only is bellow</h3>
                        <a href='http://localhost:3000/passwordreset/${token}'>click</a>
                    </div>`
                })
                res.status(200).json("Verification message send your email address successfully") 
            }else{
            res.status(400).json("User not verified account")
            }
        }else{
            res.status(400).json("User Not Found Create a account")
        }

    } catch (error) {
        console.log(error);
    }
})

router.get('/td',async(req,res)=>{
    try {
        const tokendata=req.headers['authorization']
        const userId=await jwt.verify(tokendata,process.env.SECRETE_KEY) 
        const userData=await userModel.findById({_id:userId.userId})
        if(userData){
            res.json({token:true})
        }else{
            res.json({token:false})
        }
    } catch (error) {
        res.json(error)
    }
})
router.post("/passwordSet",async(req,res)=>{
    try {
        const token=await req.body.token;
        const pass= await req.body.password
        const {userId}=await jwt.verify(token,process.env.SECRETE_KEY);
        if(!userId){
            return res.status(400).json("token not valid")
        }
        if(pass.newPassword !== pass.confirmPassword){
            res.status(400).json("password not same ")
        }
        const hash=await bcrypt.hash(pass.confirmPassword,10)
        pass.confirmPassword=hash;
        const password=pass.confirmPassword;
        const userAccount=await userModel.findByIdAndUpdate({_id:userId},{password:password},{new:true})
        userAccount.save()
        res.status(200).json("success full changed password")
    } catch (error) {
        res.status(400).json("Error")
    }
})
module.exports=router;