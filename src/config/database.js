const mongoose =require("mongoose");
const DB_Connection_URL = process.env.DB_CONNECTION_SECRET
console.log(DB_Connection_URL);
const DBconnect = ()=>{
    try{

         mongoose.connect("mongodb+srv://ent_ankittiwary:%23AnkitDevConnect01@cluster0.oicemgl.mongodb.net/DevConnect?retryWrites=true&w=majority");
    }
    catch(err){
        console.log("Connection to DB failed");
    }
}
    
module.exports =DBconnect;

