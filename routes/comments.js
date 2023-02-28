const express = require('express');
const router = express.Router();
const Comment = require("../schemas/comment.js");
const Posts = require("../schemas/post.js");

//댓글 조회
router.get("/:postId", async(req,res) => {
    const comments = await Comment.find({});

    const data= [];
    for(let i = 0; i < comments.length; i++){
        data.push({
          commentId : comments[i]["_id"],
          user: comments[i]["user"],
          content: comments[i]["content"],
          createdAt: comments[i]["createdAt"]
        });

    }
    res.json({data});
});

//댓글작성 API
router.post("/:postId", async(req,res) =>{
    const {postId} = req.params;
    const {user, password, content} = req.body;
    const canpw = await Posts.find({content});

    if(canpw.length){
        return res.status(400).json({
            success:false,
            errorMassage:"댓글 내용을 입력해주세요."
        })
    }
    const created_Comment = await Comment.create({postId, user, password, content});
    res.json({
        data: created_Comment
    });
})



module.exports = router;