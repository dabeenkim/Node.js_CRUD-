const express = require('express');
const router = express.Router();
const Post = require("../schemas/post.js")

//게시물 조회API
router.get("/", async (req, res) => {
  const posts = await Post.find();
  console.log(posts)
  const data = [];

  for(let i = 0; i < posts.length; i++){
    data.push({
      postId : posts[i]["_id"],
      user: posts[i]["user"],
      title: posts[i]["title"],
      content: posts[i]["content"],
      createdAt: posts[i]["createdAt"]
    });
    
  }
    res.status(200).json({ data });
  });
  
  //상세조회 API
  router.get("/:postId", (req,res) => {
    const params = req.params;
    console.log("params", params);
   
    res.status(200).json({});
  });


//게시물작성 API
  const Posts = require("../schemas/post.js")
  router.post("/", async (req,res)=> {
    const {user, title, content,createdAt,password} = req.body;
    console.log(password)
    const exposts = await Posts.find({user});

    if(exposts.length){
        return res.status(400).json({
          success:false,
          errorMessage:"데이터의 형식이 올바르지 않습니다."
        });
    }
    const now = new Date();
    const createdPost = await Posts.create({user, title, content, createdAt:now, password});
    res.json({
      data: createdPost
    });
  });

  router.put("/:postId/")

  module.exports = router;