const User = require("../models/User");
const CustomError = require('../classes/CustomError');
const asyncWrapper = require('express-async-handler');
const { sendJwtClient } = require('../helpers/tokenHelper');
const { loginForm, comparePassword } = require('../helpers/inputHelper');
const mailHelper = require('../helpers/mailHelper');

const register = asyncWrapper(async (req, res, next) => {

    const { firstName, lastName, email, password } = req.body;

    const user = await User.create({
        firstName, lastName, email, password
    });

    const data = {
        fullName: user.firstName+" "+user.lastName,
        email: user.email
    }

    sendJwtClient(user, res, data);
});

const login = asyncWrapper(async(req, res, next) => {

    if(!loginForm(req)){
        return next(new CustomError("Please check your form", 400));
    }

    const user = await User.findOne({
        email: req.body.email
    }).select("+password");

    if(!comparePassword(req.body.password, user.password)){
        return next(new CustomError("Please check your credentials", 400));
    }

    const data = {
        fullName: user.firstName+" "+user.lastName,
        email: user.email
    }

    sendJwtClient(user, res, data);
});

const logout = asyncWrapper(async(req, res, next) => {

    const { NODE_ENV } = process.env;
    return res.status(200).cookie({
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === "development" ? false : true
    }).json({
        success: true,
        message: "Logout success"
    });
});

const forgot = asyncWrapper(async (req, res, next) => {
    
    const user = await User.findOne({email:req.body.email});
    
    if(!user){
        return next(new CustomError("There is no user with that email", 400));
    }
    
    const resetPasswordToken = user.generateResetPasswordToken();

    await user.save();

    const resetPasswordUrl = `http://localhost:5000/api/auth/reset?token=${resetPasswordToken}`;

    const emailTemplate = `
        <h2>Reset Your Password Url</h2>
        <p>This <a href="${resetPasswordUrl}" target="_blank">reset password url</a> is will expire in 1 hour.</p>
    `;

    try {
        await mailHelper({
            from: process.env.SMTP_USER,
            to: req.body.email,
            subject: "Reset Your Password",
            html: emailTemplate
        })
        res.status(200).json({
            success: true,
            message: "Token Send your email"
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpire = undefined;
        await user.save();
        return next(new CustomError("Internal Server Error", 500))
    }

});

const reset = asyncWrapper(async (req, res, next) => {

    if(!req.query.token){
        return next(new CustomError("Please provide a valid token",400));
    }

    let user = User.findOne({
        resetPasswordToken: req.query.token,
        resetPasswordTokenExpire: { $gt: Date.now() }
    });

    if(!user){
        return next(new CustomError("Please provide a valid token",400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password change successfull"
    });
});


const upload = asyncWrapper(async (req, res, next) => {
    
    const user = await User.findByIdAndUpdate(req.user.id, {
        "image" : req.savedProfileImage
    },{
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        message: "Image Upload Successfull",
        data: user
    });

});

module.exports = { register, login, logout, forgot, reset, upload }