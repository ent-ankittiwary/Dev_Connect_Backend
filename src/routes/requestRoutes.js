const express = require("express");
const requestRouter = express.Router();
const { connectionRequestModel } = require("../model/connectionRequest");
const customer = require("../model/customer");
const { userAuth } = require("../middleware/userAuth");

//=======================SEND CONNECTION FROM USER, FOLLOW REQUEST========================
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      //checking toUserId is existing user
      if (fromUserId.equals(toUserId)) {
        return res
          .status(400)
          .send("You are sending connection request to yourself");
      }

      const toUser = await customer.findById(toUserId);
      if (!toUser) {
        res.send("The user you are sending request to doesn't exist");
      }
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type :" + status });
      }

      //checking from existing connection request

      const existingConnectionRequest = await connectionRequestModel.findOne({
        fromUserId: fromUserId,
        toUserId: toUserId,
      });
      if (existingConnectionRequest) {
        return res.status(400).send("This connection request already exists");
      }
      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.send({
        message: req.user.name + " is " + status + " in " + toUser.name,
        data,
      });
    } catch (err) {
      res.send(err.message);
    }
  },
);

//============================TOGGLE BETWEEN INTERESTED AND IGNORED===================
requestRouter.patch(
  "/request/existing/send/:status/:connectionId",
  userAuth,
  async (req, res) => {
    try {
      const { connectionId, status } = req.params;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type :" + status });
      }

      const connectionRequest = await connectionRequestModel.findOne({
        _id: connectionId,
        status: { $in: ["accepted", "rejected"] },
      });
      if (connectionRequest) {
        alert("this connection doesn't exists, Please Reload");
        return res.status(400).send("this connection doesn't exists");
      }
      const updatedRequest = await connectionRequestModel.findByIdAndUpdate(
        connectionId,
        { $set: { status: status } },
      );
      if (!updatedRequest) {
        return res.status(404).json({
          message: "Connection request not found",
        });
      }
      //checking from existing connection request
      res.send({
        message: "The sent request status is changed successfully",
        updatedRequest,
      });
    } catch (err) {
      res.send(err.message);
    }
  },
);

//=====================ACCEPT OR REJECT CONNECTIONS FOR FOLLOW REQUEST==================================
requestRouter.post(
  "/request/review/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { followersCount } = loggedInUser;
      const fromUserId = req.user._id; // it is received from user Auth
      const { status, toUserId } = req.params;

      //requestId here is the connection request document id
      //abhishek -> ankit
      //loggedInId = toUserId
      //status = intrested then only accept or reject
      //status = ignored then could never send accept or reject;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send({ message: "Status not allowed" });
      }
      const connectionRequest = await connectionRequestModel.findOne({
        fromUserId: toUserId,
        toUserId: fromUserId, //logged in user
        status: "interested", // following request accepted;
      }); //checking connection req to logged in user
      if (!connectionRequest) {
        return res.status(400).json({
          message: "Connection request is not found,Please Reload",
        });
      }
      connectionRequest.status = status; //old status will be replaced with new status passed by user through url
      const data = await connectionRequest.save();
      const OtherUser = await customer.bulkWrite([
        {
          updateOne: {
            filter: { _id: toUserId },
            update: { $inc: { followingCount: 1 } },
          },
        },
        {
          updateOne: {
            filter: { _id: loggedInUser._id },
            update: { $inc: { followersCount: 1 } },
          },
        },
      ]);

      res.send({ message: "Connection request is "+status, data });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },
);

//========= DELETE SENT REQUEST==================
requestRouter.delete(
  "/delete/requested/connections/:docId",
  userAuth,
  async (req, res) => {
    try {
      const { docId } = req.params;

      const deletedConnectionReq =
        await connectionRequestModel.findOneAndDelete({_id:docId,status:{$nin:["rejected","accepted"]}});
        if(!deletedConnectionReq){
            return res.status(200).send({message:"Connection Request is not Found"})
        }
      res.send({
        message: "This connection Request is deleted successfully",
        data: deletedConnectionReq,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
);

//================DELETE FOLLOWING ======================================
requestRouter.delete(
  "/delete/followings/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const { toUserId } = req.params;
      const deletedFollowings = await connectionRequestModel.findOneAndDelete({
        fromUserId: loggedInUserId,
        toUserId: toUserId,
      }); // deleting following
      if (!deletedFollowings) {
        return res.status(200).send({ message: "Connection not found,Please Reload" });
      }
      await customer.bulkWrite([
        {
          updateOne: {
            filter: { _id: toUserId },
            update: { $inc: { followersCount: -1 } },
          },
        },
        {
          updateOne: {
            filter: { _id: loggedInUserId },
            update: { $inc: { followingCount: -1 } },
          },
        },
      ]);

      res.status(200).send({
        message: "This accepted connection is deleted successfully",
        data: deletedFollowings,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
);

//============================DELETE FOLLOWERS===================================
requestRouter.delete(
  "/delete/followers/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const { toUserId } = req.params;
      const deletedFollowers = await connectionRequestModel.findOneAndDelete({
        toUserId: loggedInUserId,
        fromUserId: toUserId,
      }); // deleting following
      if (!deletedFollowers) {
        return res.status(200).send({ message: "Connection not found, Please Reload" });
      }
      await customer.bulkWrite([
        {
          updateOne: {
            filter: { _id: toUserId },
            update: { $inc: { followingCount: -1 } },
          },
        },
        {
          updateOne: {
            filter: { _id: loggedInUserId },
            update: { $inc: { followersCount: -1 } },
          },
        },
      ]);

      res.status(200).send({
        message: "This accepted connection is deleted successfully",
        data: deletedFollowers,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  },
);

module.exports = { requestRouter };
