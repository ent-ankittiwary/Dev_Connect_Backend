const mongoose =require("mongoose");
const DBconnect = ()=>{
    try{

         mongoose.connect("mongodb://localhost:27017/Ankit27jan");
    }
    catch(err){
        console.log("Connection to DB failed");
    }
}
    
module.exports =DBconnect;

