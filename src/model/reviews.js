//this will be one to many relationship as one listing can have many reviews;
const mongoose=require('mongoose');
const customer = require('./customer');

const reviewSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer",
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer",
        required: true
    },
    comment: {
        type: String,
        trim: true,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }
}, { timestamps: true });

reviewSchema.index(
  { fromUserId: 1, toUserId: 1 },
  { unique: true }
);


const Review = mongoose.model("Review",reviewSchema);
module.exports={Review}; 