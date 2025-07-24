const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      index: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email....");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("require a strong password....");
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzJtv72esjEWvfSpkux9LhOEGiBQ5vuR8drQ&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("invalid photourl....");
        }
      },
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("gender invalid....");
        }
      },
    },
    skills: {
      type: [String],
    },
    about:{
      type: String
    }
  },
  { timestamps: true }
);
userSchema.methods.getJwt = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isValid = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isValid;
};
module.exports = mongoose.model("User", userSchema);
