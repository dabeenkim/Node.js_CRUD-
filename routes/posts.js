const express = require('express');
const router = express.Router();
const Post = require("../schemas/post.js")
const authMiddleware = require("../middlewares/auth-middleware");
const JWT = require("jsonwebtoken");

//게시물 조회API
router.get("/", async (req, res) => {
 try{
  const posts = await Post.find({}).sort({ createdAt: -1 });

  const data = [];
  for(let i = 0; i < posts.length; i++){
    data.push ({
      postId: posts[i]["_id"],
      title: posts[i]["title"],
      createdAt: posts[i]["createdAt"],
    });
  };
  
  res.status(200).json({ posts: data });
}catch(err){return res.status(400).json({errorMessage: "게시글 조회에 실패하였습니다."})}
});





//게시물작성 API

router.post("/", authMiddleware, async (req, res) => {
try{
  const {userId, nickname} = res.locals.user;
  const { title, content } = req.body;
  const exposts = await Post.find({ userId });

  if(!title || !content) {
    return res.status(412).json({errorMessage:"데이터 형식이 올바르지 않습니다."})
  }
  if(title.length > 50) {
    return res.status(412).json({errorMessage: "게시글 제목의 형식이 일치하지 않습니다."})
  }
  if(content.length > 500) {
    return res.status(412).json({errorMessage: "게시글 내용의 형식이 일치하지 않습니다."})
  }
  if (!exposts) {
    return res.status(400).json({errorMessage: "데이터의 형식이 올바르지 않습니다."});
  }
  const now = new Date();
  const createdPost = await Post.create({ userId, nickname, title, content, createdAt: now , updatedAt: now});
  console.log(createdPost)
  res.status(201).json({
    data: createdPost,
    Message: "게시글을 생성하였습니다."
  });
}catch(err){
  if(err.message === "jwt must be provided"){
    return res.status(403).json({errorMessage: "로그인이 필요한 기능입니다."})
  }
  if(err.message === "jwt expired" || err.message === "invalid token"){
    return res.status(403).json({errorMessage: "전달된 쿠키에서 오류가 발생하였습니다."})
  }
  return res.status(400).json({errorMessage: "게시글 작성에 실패하였습니다."})
}
});


//게시물 상세조회API
router.get("/:postId", async (req, res) => {
  try{
  const { postId } = req.params;

  const onedata = await Post.findOne({ _id: postId }).exec();
  
  const data = {
    postId: onedata._id,
    user: onedata.user,
    nickname: onedata.nickname,
    title: onedata.title,
    content: onedata.content,
    createdAt: onedata.createdAt,
  }
  

  res.status(200).json({ data });
}catch(err){return res.status(400).json({ errorMassage: "데이터 형식이 올바르지 않습니다."})}
})



//게시글 수정api

router.put("/:postId", authMiddleware, async (req, res) => {
  const {postId} = req.params;
try{
  const { content, title } = req.body;
  const existsPosts = await Post.findOne({ _id: postId });

  if (!existsPosts) {
    return res.status(404).json({errorMassage: "게시글 조회에 실패하였습니다."});
  }
  if (existsPosts.user.toString() !== user._id.toString()) {
    return res.status(403).json({errorMessage: "게시글 수정의 권한이 존재하지 않습니다."});
  }
  if(!title || typeof title !== "string" || title.length > 50) {
    return res.status(412).json({errorMessage: "게시글 제목의 형식이 일치하지 않습니다."});
  }
  if(!content || typeof content !== "string" || content.length > 500) {
    return res.status(412).json({errorMessage: "게시글의 내용의 형식이 일치하지 않습니다."});
  }
  existsPosts.title = title;
  existsPosts.content = content;
  await existsPosts.save();

  res.status(200).json({Massage: "게시글을 수정하였습니다."});
}catch(err){
  if(err.name === "ValidationError") {
    return res.status(412).json({errorMessage:"데이터 형식이 올바르지 않습니다."});
  }else if(err.message === "jwt must be provided"){
    return res.status(403).json({errorMessage:"로그인이 필요한 기능입니다."});
  }else if(err.message === "jwt expired" || err.message == "invalid token"){
    return res.status(403).json({errorMessage: "전달된 쿠키에서 오류가 발생하였습니다."});
  }else{
    return res.status(500).json({errorMessage: "게시글 수정에 실패하였습니다."})
  }
}
})

//게시글 삭제api
router.delete("/:postId", authMiddleware, async (req, res) => {
  try{
  const { postId } = req.params;
  const existsPosts = await Post.findOne({ _id: postId });
  if (!existsPosts) {
    return res.status(404).json({Massage: "게시글이 존재하지 않습니다."});
  }
  if(existsPosts.user.toString() !== user_id.toString()) {
    return res.status(403).json({errorMessage: "게시글의 삭제 권한이 존재하지 않습니다."})
  }

  await existsPosts.deleteOne({ _id: postId });


  res.json({Message: "게시글을 삭제하였습니다."});
}catch(err){
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
  } else if (err.name === "JsonWebTokenError" && err.message === "jwt must be provided") {
    return res.status(403).json({ errorMessage: "로그인이 필요한 기능입니다." });
  } else if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
    return res.status(403).json({ errorMessage: "전달된 쿠키에서 오류가 발생하였습니다." });
  } else {
    return res.status(500).json({ errorMessage: "게시글 삭제에 실패하였습니다." });
  }
}
})

module.exports = router;