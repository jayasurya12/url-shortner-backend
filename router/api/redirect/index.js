const router=require("express").Router()
const urlModel=require("../../../models/url")

router.get("/:newCode",async(req,res)=>{
    try {
        const urlLink=await urlModel.findOne({shortedId:req.params.newCode})
        if(urlLink == null) return res.status(400).json("Page not found")
        urlLink.clicked++
        urlLink.save()

        res.redirect(urlLink.originalUrl)

    } catch (error) {
        res.json(error)
    }
})

module.exports=router