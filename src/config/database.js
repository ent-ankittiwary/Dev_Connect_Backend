const mongoose =require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const DBconnect = async ()=>{
    try{

         await mongoose.connect(process.env.DB_CONNECT);
    }
    catch(err){
        console.log("Connection to DB failed");
    }
}
    
module.exports =DBconnect;

