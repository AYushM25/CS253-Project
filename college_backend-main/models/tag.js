const mongoose = require('mongoose');
const Joi = require("joi");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  used: {
    type: Number,
    default: 0
  }
});


const Tag = mongoose.model("Tag", tagSchema);


exports.tagSchema = tagSchema;
exports.Tag = Tag;
