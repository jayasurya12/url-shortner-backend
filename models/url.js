const mongoose=require("mongoose")

const urlSchema= new mongoose.Schema({
    originalUrl:{
        type:String
    },
    shortedId:{type:String},
    shortedUrl:{type:String},
    date:{
        type:String,
        default:Date.now()
    },
    clicked:{
        type:Number,
        required:true,
        default:0
    }
},{timestamps:true})

const URLschema=mongoose.model("urls",urlSchema)

module.exports=URLschema