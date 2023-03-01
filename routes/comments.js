const express = require('express');
const router = express.Router();
const Comment = require("../schemas/comment.js");
const Posts = require("../schemas/post.js");

//댓글 조회
router.get("/:postId/comments", async (req, res) => {
    const comments = await Comment.find({}).sort({ createdAt: -1 });

    if (!comments.length) {
        return res.status(400).json({
            success: false,
            errorMassage: "데이터 형식이 올바르지 않습니다."
        })
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
});

//댓글작성 API
router.post("/:postId/comments", async (req, res) => {
    const { postId } = req.params;
    const { user, password, content } = req.body;
    const canpw = await Posts.find({ content });

    if (canpw.length) {
        return res.status(400).json({
            success: false,
            errorMassage: "댓글 내용을 입력해주세요."
        })
    }
    const created_Comment = await Comment.create({ postId, user, password, content });
    res.json({
        data: created_Comment,
        Message: "댓글을 생성하였습니다."
    });
})

//댓글 수정 api
router.put("/:postId/comments/:commentId", async (req, res) => {
    const { commentId, postId } = req.params;
    const { password, content, user } = req.body;
    const edit_Comment = await Comment.findOne({ _id: commentId, postId: postId })

    if (!content) {
        return res.status(400).json({
            message: "댓글 내용을 입력해주세요."
        })
    }
    if (edit_Comment.user !== user) {
        return res.json({
            success: false,
            Message: "데이터 형식이 올바르지 않습니다"
        })
    }

    if (edit_Comment.password !== password) {
        return res.status(400).json({
            success: false,
            Message: "데이터 형식이 올바르지 않습니다."
        })
    }

    //$set을 사용해야 해당 필드만 바뀌게된다.
    const result = await Comment.updateOne({ _id: commentId }, { $set: { content: content } });

    if (result.length === 0) {
        return res.status(400).json({
            massage: "댓글 조회에 실패했습니다."
        })
    }


    res.status(200).json({
        Massage: "댓글을 수정하였습니다."
    })
})

//댓글삭제 api
router.delete("/:postId/comments/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const { password } = req.body;

    const delete_Comment = await Comment.findOne({ _id: commentId });
    if (!delete_Comment) {
        return res.status(404).json({
            success: false,
            Message: "댓글 조회에 실패하였습니다."
        })
    }
    if (delete_Comment.password !== password) {
        return res.status(400).json({
            success: false,
            Message: "데이터 형식이 올바르지 않습니다."
        })
    }

    await delete_Comment.deleteOne({ _id: commentId });

    res.json({
        Message: "댓글을 삭제하였습니다."
    })
})

module.exports = router;