const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, "name must be atleast 3 characters long"],
  },
  age: {
    type: Number,
    min: [18, "age must be greater than 18"],
  },
  photoUrl: {
    type: String,
    default:
      "https://ongcvidesh.com/wp-content/uploads/2019/08/dummy-image.jpg",
  },
  gender: {
    type: String,
    lowercase: true,
    trim: true,
    enum: {
      values: ["male", "female", "other"],
      message: "Gender data is not valid",
    },
  },
  about: { type: String, default: "This is default about of the user" },
  skills: [String],
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "Email is not valid",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        });
      },
      message:
        "Password must be at least 8 characters and include uppercase, lowercase, number and symbol",
    },
  },
  followersCount:{
    type:Number,
    default:0
  },
  followingCount:{
    type:Number,
    default:0
  }
});



customerSchema.pre("save", async function () {

  if (!this.isModified("password")) return;
  
  const bcrypt = require("bcrypt");
  this.password = await bcrypt.hash(this.password, 10);
});

const customer = mongoose.model("customer", customerSchema);
module.exports = customer;
