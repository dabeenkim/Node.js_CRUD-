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
  },
  createdAt: {
    type: Date
  },
  password: {
    type:Number,
  }
},{ versionKey : false });

module.exports = mongoose.model("posts", postsSchema);