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
    type:String,
    required: true
  }
});

module.exports = mongoose.model("comments", commentSchema);
