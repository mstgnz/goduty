const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName   : { type:String, required:[true ,"Please provide a first name"] },
    lastName    : { type:String, required:[true, "Please provide a last name"] },
    email       : { type:String, required:[true, "Please provide a email"], unique:true, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/ },
    password    : { type:String, required:[true, "Please provide a password"], min:6, select:false },
    image       : { type:String },
    resetPasswordToken : { type:String },
    resetPasswordTokenExpire : { type:Date },
    status      : { type:Boolean, default:true },
    createdAt   : { type:Date, default:Date.now },
});

UserSchema.pre("save", function(next){
    if(!this.isModified("password")){
        next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if(err) next(err);
        bcrypt.hash(this.password, salt, (err, hash) => {
            if(err) next(err);
            this.password = hash;
            next();
        });
    });
});

UserSchema.methods.generateJwt = function(){
    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
    const payload = {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email
    }
    const token = jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: JWT_EXPIRE});
    return token;
}

UserSchema.methods.generateResetPasswordToken = function(){
    const randomHex = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("SHA256").update(randomHex).digest("hex");
    this.resetPasswordTokenExpire = Date.now() + parseInt(process.env.RESET_PASSWORD_EXPIRE);
    return this.resetPasswordToken;
}

module.exports = mongoose.model("User", UserSchema);