const mongoose =require("mongoose");
const api = process.env.DB_CONNECTION_SECRET;
const DBconnect = ()=>{
    try{

         mongoose.connect(api);
       
    }
    catch(err){
        console.log("Connection to DB failed");
    }
}
    
module.exports =DBconnect;

