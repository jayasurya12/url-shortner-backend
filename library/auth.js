const jwt=require("jsonwebtoken")

async function auth(req,res,next){
    try {
        const token=await req.headers['authorization'];
        const data=await jwt.verify(token,process.env.SECRETE_KEY);
        req.userId=data.userId
        next()
    } catch (error) {
        console.log(error);
    }
}
module.exports= auth;