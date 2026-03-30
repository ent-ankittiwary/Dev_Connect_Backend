const mongoose =require("mongoose");
require("dotenv").config();

const DBconnect = async ()=>{
    try{

         await mongoose.connect(process.env.DB_CONNECT);
    }
    catch(err){
        console.log("Connection to DB failed");
    }
}
    
module.exports =DBconnect;

