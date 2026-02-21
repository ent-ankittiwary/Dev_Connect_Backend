const express =require("express");
const DBconnect = require("./config/database");
const customer = require("./model/customer");
const jwt = require ("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app =express();

app.use(cors({
    origin:"*", //this is whitelisting the domain name
    credentials:true,
}));


app.use(cookieParser());
app.use(express.json());
const {userAuth} = require("./middleware/userAuth");
const bcrypt =require("bcrypt");
const revalidate = require("./scripts/revalidate");
const { validateSignUpData } = require("./utils/validateIncomingData");
const {authRouter} = require("./routes/authRoutes");
const {requestRouter} = require("./routes/requestRoutes");
const {userRouter} = require("./routes/userRoutes");
const {reviewRouter} =require("./routes/reviewRoutes");


app.get("/",async(req,res)=>{
    res.send("Server is setup")
});


//authRouter
app.use("/",authRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
app.use("/",reviewRouter);
//secure api acess
app.get("/profile",userAuth,async(req,res)=>{
    const {name,age,email} =req.user;
    res.send({
        "message":`Welcome ${name}`,
        "age":age,
        "email":email
    })
})




 //connection to database
async function startServer(){
    try{
        await DBconnect();
        console.log("Successfullly connected to DB");
        await app.listen(9193,()=>{
            console.log("Server is listening to port no 9193")
        });

    }
    catch(err){
        console.log(err);
    }
}
startServer();