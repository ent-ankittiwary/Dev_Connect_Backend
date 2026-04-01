const mongoose =require("mongoose");
const DBconnect = async ()=>{
    try{
        console.log(process.env.DB_CONNECTION_SECRET);
         await mongoose.connect(process.env.DB_CONNECTION_SECRET);
    }
    catch(err){
        console.log("Connection to DB failed");
    }
}
    
module.exports =DBconnect;

