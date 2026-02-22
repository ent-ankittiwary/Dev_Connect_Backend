const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middleware/userAuth");
const { connectionRequestModel } = require("../model/connectionRequest");
const customer = require("../model/customer");
const { authRouter } = require("./authRoutes");
const { validateEditData } = require("../utils/validateEditData");
const { Review } = require("../model/reviews");



userRouter.get("/profile",userAuth,async(req,res)=>{
  try{
    const {_id,name,age,photoUrl,gender,about,skills,email} =req.user;
    const userData ={_id,name,age,photoUrl,gender,about,skills,email};
    res.send(userData);
  }
  catch(err){
    res.status(401).send("User Not Found,Please Register/Login First");
  }
});

// ================= INTERESTED CONNECTIONS =================

userRouter.get("/interested/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connections = await connectionRequestModel
      .find({
        toUserId: loggedInUserId,
        status: "interested",
      })
      .populate("fromUserId", ["name", "age", "photoUrl","gender","about","skills"]);

    if (!connections || connections.length === 0) {
      return res.status(404).json({
        message: "No users are interested in you yet",
      });
    }
    // =========WE WILL HANDLE THIS CASE FROM FRONTEND

    res.status(200).json({
      message: "Interested connections fetched successfully",
      data: connections,
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch interested connections",
      error: err.message,
    });
  }
});

// // ================= ACCEPTED CONNECTIONS =================

// userRouter.get("/accepted/connections", userAuth, async (req, res) => {
//   console.log(req.user._id);
//   try {
//     const loggedInUserId = req.user._id;

// const connections = await connectionRequestModel
//   .find({
//     status: "accepted",
//     $or: [
//       { fromUserId: loggedInUserId },
//       { toUserId: loggedInUserId },
//     ],
//   })
//   .populate("fromUserId", ["name", "age", "photoUrl", "gender", "about", "skills"])
//   .populate("toUserId", ["name", "age", "photoUrl", "gender", "about", "skills"]);

//     if (!connections || connections.length === 0) {
//       return res.status(404).json({
//         message: "No accepted connections found",
//       });
//     }

//     res.status(200).json({
//       message: "Accepted connections fetched successfully",
//       data: connections,
//     });

//   } catch (err) {
//     res.status(500).json({
//       message: "Failed to fetch accepted connections",
//       error: err.message,
//     });
//   }
// });

// // =======================================FEED======================================

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1 ;
    const limit = parseInt(req.query.limit) || 10;
    skip =(page-1)*limit;
    const USER_SAFE_DATA=["name","age","photoUrl","gender","about","skills"];




    console.log("LoggedInUser:", loggedInUser._id);

    const connectionRequests = await connectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ]
    });
    console.log(connectionRequests);

    const hiddenUserFromFeed = new Set();
    hiddenUserFromFeed.add(loggedInUser._id.toString()); // hide self

    connectionRequests.forEach((cr) => {
      hiddenUserFromFeed.add(cr.fromUserId.toString());
      hiddenUserFromFeed.add(cr.toUserId.toString());
    });

    console.log("Hidden users:", Array.from(hiddenUserFromFeed));

    const users = await customer.find({
      _id: { $nin: Array.from(hiddenUserFromFeed) }
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);



    console.log("Feed users:", users.length);

    res.json(users);

  } catch (err) {
    res.status(400).send(err.message);
  }
});

//==================Edit Profile ===============================

userRouter.patch("/profile/edit",userAuth,async(req,res)=>{
  try{
    await validateEditData(req);
    const {_id} = req.user;
    const {name,age,photoUrl,gender,about,skills} =req.body;
    const updatedUser = await customer.findByIdAndUpdate({_id:_id},{$set:{name:name,age:age,photoUrl:photoUrl,gender:gender,about:about,skills:skills}},{new:true});
    res.send({message:`${updatedUser.name} ,Your profile is successfully edited`,
      data:updatedUser
  });
  }
  catch(err){
    res.status(400).send({message:"Age must be greater than 18 or Invalid Edit Request"});
  }
});

//=====================CONNECTIONS ROUTE=============================

userRouter.get("/accepted/connections", userAuth, async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    const connections = await connectionRequestModel
      .find({
        status: "accepted",
        $or: [
          { fromUserId: loggedInUserId },
          { toUserId: loggedInUserId }
        ]
      })
      .populate("fromUserId", ["name", "age", "photoUrl", "gender", "about", "skills"])
      .populate("toUserId", ["name", "age", "photoUrl", "gender", "about", "skills"]);

      console.log(connections);

    res.status(200).json({
      message: "Accepted connections fetched successfully",
      data: connections
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch accepted connections",
      error: err.message
    });
  }
});

//==============Deleted Connections=============================

userRouter.delete("/accepted/connection/delete/:id",userAuth,async(req,res)=>{
  try{
    const {id} = req.params;
    const deletedConnection = await connectionRequestModel.findOneAndDelete({_id:id});
    res.send({message:"The connection deleted Successfully",data:deletedConnection});
  }
  catch(err){
    res.send(err);
  }
})


//=====================reviews=======================


userRouter.get("/review/:toUserId",userAuth, async (req, res) => {

  // const {_id} =req.user;
  const {toUserId} = req.params;
 const reviews = await Review.find({ toUserId: toUserId })
  .populate("fromUserId", "name age photoUrl")
  .sort({ createdAt: -1 });



    res.send({message:"Reviews Fetched successfully",data:reviews});
});
module.exports = { userRouter };

//demo2