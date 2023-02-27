const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  user: {
    type:String,
    required: true,
    unique:  true,
  },
  title: {
    type:String,
    required: true,
  },
  content: {
    type:String,
    required: true,
  },
  createdAt: {
    type: Date
  },
  password: {
    type:String,
  }
});

module.exports = mongoose.model("posts", postsSchema);