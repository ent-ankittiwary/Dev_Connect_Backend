//send review 
//edit review 
//delete review

const express = require("express");
const reviewRouter = express.Router();
const {Review} = require("../model/reviews");
const { userAuth } = require("../middleware/userAuth");


//=====================create Review ===========================================

reviewRouter.post("/review/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserIdAuthorized = req.user._id;
        console.log(fromUserIdAuthorized);
        const toUserId = req.params.toUserId;
        console.log(toUserId);
        const { fromUserId,comment, rating } = req.body;
        // if(!fromUserIdAuthorized.equals(fromUserId)){
        //     return res.status(400).send("Please Login first Then comment");

        // }

        if (fromUserId.toString() === toUserId.toString()) {
            return res.status(400).json({ message: "You cannot review yourself" });
        }



        const oldReview = await Review.findOne({toUserId:toUserId,fromUserId:fromUserId}); 
        if(oldReview){
            console.log(oldReview);
            return res.send("You have already reviewed");
        }

        const review = await Review.create({
            fromUserId,
            toUserId,
            comment,
            rating
        });

        res.status(201).json({message:"Review Created Successfully",data:review});

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//================================edit review=============================


reviewRouter.patch("/review/:toUserId",userAuth,async(req,res)=>{

    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        
        const review = await Review.findOne({fromUserId:fromUserId,toUserId:toUserId});
        if(!review){
            res.send("No review exists to edit");
        }
        const {comment,rating}=req.body;
        const editedReview = await Review.findOneAndUpdate({fromUserId:fromUserId,toUserId:toUserId},{$set:{comment:comment,rating:rating}});
        res.send("This comment has been successfully Edited")
    }
    catch(err){
        res.send(err);
    }
})




//=============================delete review============================================

reviewRouter.delete("/review/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id;
       const toUserId = req.params.toUserId;
   
       const deletedReview = await Review.findOneAndDelete({fromUserId:fromUserId,toUserId:toUserId});
       if(!deletedReview){
        return res.send("No such review exist");
       }
       res.status(201).json({message:"comment deleted successfully",data:deletedReview});
    }
    catch(err){
        res.send(err.message);
    }
})

module.exports ={reviewRouter};
