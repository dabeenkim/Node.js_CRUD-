const express = require("express");
const router = express.Router(); 
const JWT = require("jsonwebtoken");
const User = require("../schemas/user.js")

//회원가입 api
router.post("/signup", async(req,res) => {
  try{
    const { nickname, password, confirmpassword } = req.body;
    
    const nicknameRegax = /^[a-zA-Z0-9]{3,}$/;
    if(!nicknameRegax.test(nickname)){
        return res.status(412).json({ error: "닉네임의 형식이 일치하지 않습니다."})
    }

    const passwordRegax = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
    if(!passwordRegax.test(password)) {
        return res.status(412).json({ errorMessage: "패스워드 형식이 일치하지 않습니다." })
    }
    if(password.includes(nickname)) {
        return res.status(412).json({ errorMessage: "패스워드에 닉네임이 포함되어 있습니다." })
    }
    if(password !== confirmpassword) {
        res.status(412).json({ errorMessage: "패스워드가 일치하지 않습니다." });
        return;
    }

    
    const existsUsers = await User.findOne({$or: [{nickname}]});
    if(existsUsers){
        res.status(412).json({ errorMessage: "중복된 닉네임입니다."});
        return;
    }

    const user = new User({ nickname, password });
    await user.save();

    res.status(201).json({message: "회원가입에 성공하였습니다."})
    } catch (error) {
        return res.status(400).json({errorMessage: "로그인에 실패하였습니다."})
    }
})
// // 닉네임 유효성 검사
// if (typeof nickname !== 'string' || nickname.length < 3) {
//     return res.status(400).json({ error: '닉네임은 최소 3자 이상의 문자열이어야 합니다.' });
//   }
  
//   // 비밀번호 유효성 검사
//   if (typeof password !== 'string' || password.length < 4) {
//     return res.status(400).json({ error: '비밀번호는 최소 4자 이상의 문자열이어야 합니다.' });
//   }
  
//   // 닉네임과 같은 비밀번호인지 검사
//   if (password.includes(nickname)) {
//     return res.status(400).json({ error: '비밀번호에는 닉네임이 포함될 수 없습니다.' });
//   }
  
//   // 비밀번호 확인 검사
//   if (typeof passwordConfirm !== 'string' || password !== passwordConfirm) {
//     return res.status(400).json({ error: '비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
//   }


//로그인api
router.post("/login", async(req,res) => {
    const { nickname, password } = req.body;

    const user = await User.findOne({ nickname });

    if(!user || password !== user.password){
        res.status(400).json({
            errorMessage: "닉네임 또는 패스워드를 확인해주세요."
        });
        return;
    }

    const token = JWT.sign(
        {userId: user.userId}, "custom-secret-key"
    );

    res.cookie("Authorization", `Bearer ${token}`);
    res.status(200).json({ token });
});






module.exports = router;