const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    maxlength: 1024,
    minlength: 5,
  },
  userType: {
    type: String,
    enum: ['collegeS', 'collegeG', 'Admin'],
    required: true, // User type is required during registration
  },
  isVerified: {
    type: Boolean,
    default: false, // Default value set to false
  },
  AcademicOpinion: {
    type: String,
  },
  NonAcademicOpinion: {
    type: String,
  },
  PlacementOpinion: {
    type: String,
  },
  OverallOpinion: {
    type: String,
  },
  college: {
    type: String,
  },
  branch: {
    type: String,
  },
  year: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtPrivateKey")
  );
  return token;
};

exports.User = User;
