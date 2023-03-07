const express = require('express');
const router = express.Router();
const Comment = require("../schemas/comment.js");
const Posts = require("../schemas/post.js");
const authMiddleware = require("../middlewares/auth-middleware");

//댓글 조회
router.get("/:postId/comments", async (req, res) => {
    try{
    const comments = await Comment.find({}).sort({ createdAt: -1 });

    if (!comments) {
        return res.status(400).json({ errorMessage: "게시글이 존재하지 않습니다."})
    }
    const data = [];
    for (let i = 0; i < comments.length; i++) {
        data.push({
            commentId: comments[i]["_id"],
            user: comments[i]["user"],
            content: comments[i]["content"],
            createdAt: comments[i]["createdAt"],
        });

    }
    res.json({ data });
}catch(err){
    return res.status(400).json({errorMessage:"댓글 조회에 실패하였습니다."})
}
});

//댓글작성 API
router.post("/:postId/comments", authMiddleware, async (req, res) => {
  try{
    const { postId } = req.params;
    const { comment } = req.body;

    const canpw = await Posts.findById({ postId });
    if(!canpw) {
        return res.status(412),json({errorMessage:"게시글이 존재하지 않습니다."})
    }
    if (comment || comment.length > 500) {
        return res.status(400).json({errorMessage: "데이터 형식이 올바르지 않습니다."})
    }
    const now = new Date();
    const created_Comment = await Comment.create({ postId, comment, createdAt:now, updatedAt:now});
    res.json({
        data: created_Comment,
        Message: "댓글을 생성하였습니다."
    });
}catch(err){
    if(err.name === "ValidationError") {
        return res.status(412).json({errorMessage:"데이터 형식이 올바르지 않습니다."})
    } else if(err.name === "TokenExpiredError" || err.name === "JsonWebTokenError"){
        return res. status(403).json({errorMessage:"전달된 쿠키에서 오류가 발생하였습니다."})
    } else{
        return res.status(400).json({errorMessage:"댓글 작성에 실패하였습니다."})
    }
}
})

//댓글 수정 api
router.put("/:postId/comments/:commentId", authMiddleware, async (req, res) => {
try{
    const { commentId } = req.params;
    const { comment } = req.body;

    //$set을 사용해야 해당 필드만 바뀌게된다.
    const result = await Comment.updateOne({ _id: commentId }, { $set: { comment: comment } });

    if (!result) {
        return res.status(400).json({errorMessage: "게시글이 존재하지 않습니다." })
    }
    if(!comment){
        res.status(412).json({errorMessage: "데이터 형식이 올바르지 않습니다."})
    }
    res.status(200).json({Message: "댓글을 수정하였습니다."})
} catch(err){
    if(err.name === "CastError") {
        return res.status(404).json({errorMessage:"댓글이 존재하지 않습니다."})
    }
    if(err.message === "Forbidden") {
        return res.status(403).json({errorMessage:"댓글의 수정 권한이 존재하지 않습니다."})
    }
    if(err.massage === "jwt expired" || err.message === "invalid token"){
        return res.status(403).json({errorMessage:"전달된 쿠키에서 오류가 발생하였습니다."})
    }
    return res.status(400).json({errorMessage: "댓글 수정에 실패하였습니다."})
}
})

//댓글삭제 api
router.delete("/:postId/comments/:commentId", authMiddleware, async (req, res) => {
    const { postId, commentId } = req.params;
try{
    const post = await Posts.findOne({_id: postId});
    if(!post) {
        return res.status(404).json({errorMessage:"게시글이 존재하지 않습니다."})
    }
    const delete_Comment = await Comment.findOne({ _id: commentId });
    if (!delete_Comment) {
        return res.status(404).json({errorMessage: "댓글 조회에 실패하였습니다."})
    }
    if(delete_Comment.post.toString() !== postId){
        return res.status(400).json({errorMessage:"댓글과 게시글이 일치하지 않습니다."})
    }
    if(delete_Comment.author.toString() !== req.user._id){
        return res.status(403).json({errorMessage:"댓글의 삭제 권한이 존재하지 않습니다."})
    }
    
    await delete_Comment.deleteOne({ _id: commentId });

    res.json({Message: "댓글을 삭제하였습니다."})
}catch(err){
    if(err.kind === "ObjectId") {
        return res.status(400).json({ errorMessage: "올바르지 않은 Object ID입니다."})
    } else {
        return res.status(500).json({errorMessage: "예상치 못한 오류가 발생했습니다."})
    }
}
})

module.exports = router;