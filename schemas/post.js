const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  user: {
    type:String,
    required: true,
  },
  title: {
    type:String,
  },
  content: {
    type:String,
    required: true,
  },
  createdAt: {
    type: Date
  },
  password: {
    type:Number,
  }
});

module.exports = mongoose.model("posts", postsSchema);