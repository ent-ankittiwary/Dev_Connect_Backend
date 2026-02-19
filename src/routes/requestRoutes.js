const express =require("express");
const requestRouter = express.Router();
const {connectionRequestModel} =require("../model/connectionRequest");
const customer = require("../model/customer");
const {userAuth} = require("../middleware/userAuth");

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        //checking toUserId is existing user
        if(fromUserId.equals(toUserId)){
            return res.status(400).send("You are sending connection request to yourself");
        }

        const toUser = await customer.findById(toUserId);
        if(!toUser){
            res.send("The user you are sending request to doesn't exist");
        }
        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message:"Invalid status type :"+status});
          }

        //checking from existing connection request

        const existingConnectionRequest = await connectionRequestModel.findOne(
            {
                $or:[
                    {fromUserId:fromUserId,toUserId:toUserId},
                    {fromUserId:toUserId,toUserId:fromUserId}
                ]
            }
        );
        //
        if(existingConnectionRequest){
            return res.status(400).send("The connection request already exists");
        }
        const connectionRequest = new connectionRequestModel({
            fromUserId,
            toUserId,
            status
        });
        const data =await connectionRequest.save();
        res.send({
            message:req.user.name+" is "+status+" in "+toUser.name,
            data
        })
    }
    catch(err){
        res.send(err.message);
    }
})

//make a route to delete connection request with ignored status so that user can send fresh connections
requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user; // it is received from user Auth
        const {status,requestId} = req.params;

        //requestId here is the connection request document id
        //abhishek -> ankit
        //loggedInId = toUserId
        //status = intrested then only accept or reject 
        //status = ignored then could never send accept or reject;
        const allowedStatus =["accepted","rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).send({message:"Status not allowed"});
        }
        const connectionRequest = await connectionRequestModel.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:"interested" // only interested request will be accepted
        });
        console.log(connectionRequest);
        if(!connectionRequest){
            return res.status(400).json({message:"Connection request is not found,You cannot accept or reject it"});
        }

        connectionRequest.status = status; //old status will be replaced with new status passed by user through url;
        const data = await connectionRequest.save();
        res.send({message:"Connection request accepted",data});
    }
    catch(err){
        res.status(500).send({ message: err.message });   
    }

});

// make a route to delete rejected connection so that user could resend a request;

module.exports = {requestRouter};