const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  postId: {
    type: Number,
    required: true,
    unique: true,
    default: 0,
  },
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

postsSchema.pre("save", async function(next) {
  const lastPost = await this.construtor.findOne(
    {},
    {_id: 0, postId: 1},
    {sort: {postId: -1}}
  );
  this.postId = (lastPost?.postId ?? 0) + 1;
  next();
})

module.exports = mongoose.model("posts", postsSchema);