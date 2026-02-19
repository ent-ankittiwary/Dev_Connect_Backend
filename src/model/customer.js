const mongoose = require("mongoose");
const validator =require("validator");
const customerSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:[3,"name must be atleast 3 characters long"]
    },
    age:{
        type:Number,
        min:[18,"age must be greater than 18"]
    },
    photoUrl:{
        type:String,
        default:"https://ongcvidesh.com/wp-content/uploads/2019/08/dummy-image.jpg",
    },
    gender: {
      type: String,
      lowercase: true,
      trim: true,
      // custom validation
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    about: { type: String, default: "This is default about of the user" },
    skills: [String],
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator: function (value){
                return validator.isEmail(value)
            },
            message:"Email is not valid"
            }
        },
    password:{
        type:String,
        required:true,
        validate:{
            validator: function (value){
                return validator.isStrongPassword(value);
            },
            message:"Password is not valid"
        }
    },
});



const customer =mongoose.model("customer",customerSchema);
module.exports =customer;