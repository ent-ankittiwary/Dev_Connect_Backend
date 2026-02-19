//token nikal k validate krna hain 
const jwt = require("jsonwebtoken");
const userB =require("../model/customer");
const userAuth = async(req,res,next)=>{
    try{
        //Read the token from req.cookies
        const {token} =req.cookies;
        if(!token){
            return res.status(401).send("Invalid token,please Login first");
        }
        //validate the given token

        const decodedMessageObject =await jwt.verify(token,"<mysecretkey>");
        // decoded token will store (_id,pat,expiry)
        const {_id}= decodedMessageObject;
        const user = await userB.findOne({_id:_id});
        if(!user){
            throw new Error("User is not signed in OR User doesn't exist");
        }
        req.user = user;
        console.log("Authorised");
        next();
    }
    catch(err){
        res.status(401).send("Error:"+err.message);
    }
}
module.exports = {userAuth};