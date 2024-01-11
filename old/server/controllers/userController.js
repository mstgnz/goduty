const User = require('../models/User');
const asyncWrapper = require('express-async-handler');
const CustomError = require('../classes/CustomError');


const getUser = asyncWrapper(async(req, res, next) => {

    let user = null;

    if(req.params.id){
        user = await User.findById(req.params.id);
    }else{
        user = await User.find({});
    }

    if(!user){
        return next(new CustomError("There is no such user"));
    }

    return res.status(200).json({
        success:true,
        data:user
    });
});

const deleteUser = asyncWrapper(async (req, res, next) => {
    const user = await User.deleteOne({
        email: req.body.email
    });
    return res.status(200).json({
        success: true,
        message: "user deleted"
    });
});


module.exports = {
    getUser,
    deleteUser
}