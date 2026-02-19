const express = require("express");
const authRouter =express.Router();
const revalidate =require("../scripts/revalidate");
const customer =require("../model/customer");
const jwt =require("jsonwebtoken");
const {validateSignUpData}= require("../utils/validateIncomingData");
const User = require("../model/customer");
const bcrypt = require("bcrypt");

//signup

authRouter.post("/signup",async(req,res)=>{
    try{
        validateSignUpData(req);
        const {name,age,photoUrl,gender,about,skills,email,password} = req.body;
        const passwordHashed = await bcrypt.hash(password,10);
        const cust1 =new customer({
            name,
            age,
            photoUrl,
            gender,
            about,
            skills,
            email,
            password:passwordHashed
        });
        console.log(photoUrl);
        await revalidate();
        await cust1.save();
        res.send({"success":true,cust1});
    }
    catch(err){
        res.send("ERROR:"+ err.message);
    }

})


authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const cust1 = await customer.findOne({ email });

    if (!cust1) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email Or user not registered " 
      });
    }

    const passwordMatch = await bcrypt.compare(password, cust1.password);

    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { _id: cust1._id },
      "<mysecretkey>",
      { expiresIn: "8h" }
    );

    res.cookie("token", token);

    return res.status(200).json({
      success: true,
      user: cust1
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later."
    });
  }
});


//logout

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("logout successful");
})

module.exports ={authRouter};