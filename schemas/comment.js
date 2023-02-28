const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  user: {
    type:String,
    required: true,
  },
  content: {
    type:String,
    required: true,
  },
  createdAt: {
    type: String,
  },
  password: {
    type:Number,
    required: true
  }
},{ versionKey : false });

module.exports = mongoose.model("comments", commentSchema);
