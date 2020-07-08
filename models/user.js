let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let userSchema = new mongoose.Schema(
    {
        email:
        {
            type: String,
            // required: true
        },
        password:
        {
            // required: true,
            type: String
        },
        username:
        {
            type: String
        },
        tokens: [
            {
                token: { type: String }
            }
        ]
    },
    {
        timestamps: true
    }
);




//hashing a password before saving it to the database
userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 8, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});

userSchema.methods.generateJWT = async function () {


    let user = this;
    let toke = jwt.sign({ email: user.email, _id: user._id }, 'mysecret');
    user.tokens = user.tokens.concat({ toke });
    await user.save();
    return toke;

}

module.exports = mongoose.model('users', userSchema);