const mongoose =require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const api = process.env.DB_CONNECT;
const DBconnect = ()=>{
    try{

         mongoose.connect(api);
    }
    catch(err){
        console.log("Connection to DB failed");
    }
}
    
module.exports =DBconnect;

