const router=require("express").Router()
const user=require("./api/user")
const forget=require("./api/forgetPassword/forgetpass")
const urlShorted=require('./api/url-shorted')

router.use("/user",user)
router.use("/forget",forget)
router.use("/url",urlShorted)

module.exports=router;