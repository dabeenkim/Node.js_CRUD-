const express = require('express');
const router = express.Router();
const Post = require("../schemas/post.js")
const authMiddleware = require("../middlewares/auth-middleware");
const JWT = require("jsonwebtoken");

//게시물 조회API
router.get("/", async (req, res) => {
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
});





//게시물작성 API

router.post("/", authMiddleware, async (req, res) => {
  const {userId} = res.locals.user;
  const { title, content } = req.body;
  const exposts = await Post.find({ userId });

  if (!exposts) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터의 형식이 올바르지 않습니다."
    });
  }
  const now = new Date();
  const createdPost = await Post.create({ userId, title, content, createdAt: now , updatedAt: now});
  res.json({
    data: createdPost,
    Message: "게시글을 생성하였습니다."
  });
});


//게시물 상세조회API
router.get("/:postId", async (req, res) => {
  const { postId } = req.params;

  const onedata = await Post.findOne({ _id: postId }).exec();

  //다른값이 오면 null이나 undifined가 나오게된다.
  if (!onedata) {
    return res.status(400).json({ errorMassage: "데이터 형식이 올바르지 않습니다."})
  }
  const data = {
    postId: onedata._id,
    user: onedata.user,
    title: onedata.title,
    content: onedata.content,
    createdAt: onedata.createdAt,
  }
  

  res.status(200).json({ data });
})


//게시글 수정api

router.put("/:postId", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { postId } = req.params;
  const { password, user, content, title } = req.body;

  const existsPosts = await Post.findOne({ _id: postId });
  if (!existsPosts) {
    return res.status(404).json({
      success: false,
      Massage: "게시글 조회에 실패하였습니다."
    });
  }

  if (existsPosts.password !== password) {
    return res.status(400).json({
      success: false,
      Message: "데이터 형식이 올바르지 않습니다."
    })
  }

  existsPosts.user = user;
  existsPosts.content = content;
  existsPosts.title = title;
  await existsPosts.save();


  res.status(200).json({
    Massage: "게시글을 수정하였습니다."
  });
})

//게시글 삭제api
router.delete("/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { password } = req.body;

  const existsPosts = await Post.findOne({ _id: postId });
  if (!existsPosts) {
    return res.status(404).json({
      success: false,
      Massage: "게시글 조회에 실패하였습니다."
    });
  }


  await existsPosts.deleteOne({ _id: postId });


  res.json({
    Message: "게시글을 삭제하였습니다."
  })
})

module.exports = router;