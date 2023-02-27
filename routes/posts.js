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
  
    // const data = [
    //   {      
    //     "postId": "61",      
    //     "user": "Developer",      
    //     "title": "안녕하세요",      
    //     "createdAt": "2022-07-19T15:43:40.266Z"    
    //     },  
    //     {      
    //       "postId": "62d6d12cd88cadd496a9e54e",      
    //       "user": "Developer",      
    //       "title": "안녕하세요",      
    //       "createdAt": "2022-07-19T15:43:40.266Z"    
    //       },  
    //        {      
    //       "postId": "62d6cc66e28b7aff02e82954",      
    //       "user": "Developer",      
    //       "title": "안녕하세요",      
    //       "createdAt": "2022-07-19T15:23:18.433Z"   
    //        } 
    
    // ];
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

    const exposts = await Posts.find({user});

    if(exposts.length){
        return res.status(400).json({
          success:false,
          errorMessage:"데이터의 형식이 올바르지 않습니다."
        });
    }
    
    const createdPost = await Posts.create({user, title, content, createdAt:new Date, password});
   
    
    res.json({data: createdPost});
  })

  module.exports = router;