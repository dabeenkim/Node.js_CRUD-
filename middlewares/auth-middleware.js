const JWT = require("jsonwebtoken");
const User = require("../schemas/user");

module.exports = async (req, res, next) => {
    const { Authorization } = req.cookies;
    const {authType, authToken} = (Authorization ?? "").split(" ");

    if(!authToken || authType !== "Bearer") {
        res.status(403).send({errorMessage: "로그인이 필요한 기능입니다."});
        return;
    } 
    try {
        const {userId} = JWT.verify(authToken, "custom-secret-key");
        const user = await User.findById(userId);
        res.locals.user = user;
        next();
    }catch(err) {
        console.error(err);
        res.status(403).send({errorMessage:"로그인이 필요한 기능입니다."});
    }
};