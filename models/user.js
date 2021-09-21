const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:String,
    email:{
        type:String,
        required:true,
        unique:true,
        dropdups:true
    },
    password:{
        type:String,
        required:true
    },
    verified:{
        type:Boolean,
        default:false
    },
    date:{
        type:Date,
        default:Date.now()
    },
    urlData:[{
        type:mongoose.Types.ObjectId,
        ref:'urls'
    }]
})
const user=mongoose.model('users',UserSchema)

module.exports= user
