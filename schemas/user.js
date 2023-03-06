const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    "userId":{
        type: Number,
        required: true,
        unique: true,
        default: 0,
    },
    "nickname":{
        type: String,
        required: true,
        unique: true,
    },
    "password":{
        type: String,
        required: true,
    }
});

UserSchema.pre("save", async function(next) {
    const lastUser = await this.constructor.findOne(
        {},
        {_id: 0, userId: 1},
        {sort: {userId: -1}}
    );
    this.userId = (lastUser?.userId ?? 0) + 1;
    next();
})


// UserSchema.virtual("userId").get(function () {
//     return this._id.toHexString();
// });

// UserSchema.set("toJSON", {
//     virtuals : true,
// })


const Users = mongoose.model('User', UserSchema);

module.exports = Users;

//module.exports = mongoose.model('User', UserSchema)
//이렇게 사용해도됨