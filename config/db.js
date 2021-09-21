const mongoose=require("mongoose")

const connect_db=async()=>{
    try {
        const db=await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log(`mongoose connect ${db.connection.host}`)
    } catch (error) {
        console.log(error);
    }
} 

module.exports = connect_db;