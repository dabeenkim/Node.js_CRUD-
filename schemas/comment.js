const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
//   post_Id: {
//     type: Number,
//     required: true,
//     unique: true
//   },
//   comment_Id: {
//     type: Number,
//     required: true,
//     unique: true
//   },
  user: {
    type:String,
    required: true,
    unique:  true,
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
