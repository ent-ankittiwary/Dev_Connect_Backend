//send review 
//edit review 
//delete review

const express = require("express");
const reviewRouter = express.Router();
const {Review} = require("../model/reviews");
const { userAuth } = require("../middleware/userAuth");
const { aggregate } = require("../model/customer");


//=====================create Review ===========================================

reviewRouter.post("/review", userAuth, async (req, res) => {
    try {
        const fromUserIdAuthorized = req.user._id;
        const { toUserId,comment, rating } = req.body;
        console.log(toUserId);

        if (fromUserIdAuthorized.toString() === toUserId.toString()) {
            return res.status(400).json({ message: "You cannot review yourself" });
        }

        const oldReview = await Review.findOne({toUserId:toUserId,fromUserId:fromUserIdAuthorized}); 
        if(oldReview){
            console.log(oldReview);
            return res.send("You have already reviewed");
        }

        const review = await new Review({
            fromUserId:fromUserIdAuthorized,
            toUserId,
            comment,
            rating
        }).populate("fromUserId",["name","age","photoUrl"]);
        await review.save();
        res.status(201).json({message:"Review Created Successfully",data:review});

    } catch (err) {
        res.status(500).json({ message: err});
    }
});

//================================edit review=============================


reviewRouter.patch("/review/:reviewId",userAuth,async(req,res)=>{

    try{
        const fromUserId = req.user._id;
        const {reviewId} = req.params;
        // const toUserId = req.params.toUserId;
        
        const review = await Review.findOne({_id:reviewId});
        if(!review){
            res.send("No review exists to edit");
        }
        const {comment,rating}=req.body;
        const editedReview = await Review.findOneAndUpdate({_id:reviewId},{$set:{comment:comment,rating:rating}})
        .populate("fromUserId",["name","age","photoUrl"]);
        res.send({message:"This comment has been successfully Edited",data:editedReview});
    }
    catch(err){
        res.send(err);
    }
})




//=============================delete review============================================

reviewRouter.delete("/review/:id",userAuth,async(req,res)=>{
    try{
        const reviewId =req.params.id;
   
       const deletedReview = await Review.findOneAndDelete({_id:reviewId});
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
