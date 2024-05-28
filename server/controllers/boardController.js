const Board = require("../models/Board");
const User = require("../models/User");
const CustomError = require('../classes/CustomError');
const asyncWrapper = require('express-async-handler');
const mailHelper = require('../helpers/mailHelper');

// Pano Create
const boardCreate = asyncWrapper(async (req, res, next) => {
    let result = {};

    const board = await Board.create({
        title : req.body.title,
        founder: req.user.id
    });

    if(board){
        result["board"] = board;
    }

    return res.status(200).json({
        success:true,
        data:result
    });

});

// Pano List
const boardList = asyncWrapper(async (req, res, next) => {
    const board = await Board.find({
        founder: req.user.id
    });

    return res.status(200).json({
        success: true,
        message: "board list",
        data: board
    });
});

// Pano Delete
const boardDelete = asyncWrapper(async (req, res, next) => {

    let board = await Board.findOne({
        founder : req.user.id,
    });

    return res.status(200).json({
        success: true,
        message: "board deleted",
        data: board
    });

});

// Pano Update
const boardUpdate = asyncWrapper(async (req, res, next) => {
    // Relation userId ve boardID eşleştirmesi yapılacak, root true ise adını değişebilecek
    res.status(200).json({
        success: true,
        message: "board update"
    });
});

// Davet
const boardInvitation = asyncWrapper(async (req, res, next) => {
    /**
     * email ile davet atılacak
     * email kayıtlı ise bağlantı sağlanacak
     * email kayıtlı değilse kayıt oluşturulacak
     */

    // board check
    let board = await Board.findOne({
        slug: req.body.slug,
        founder: req.user.id,
    }).populate({'path':'members', 'select':'email'});
    console.log(board);return;
    if(!board){
        return next(new CustomError("Board bulunamadı",400))
    }

    // user check
    let user = await User.findOne({email:req.body.email});
    if(!user){
        user = await User.create({
            firstName: "invite",
            lastName: "invite",
            email: req.body.email,
            password: "putduty123"
        });
    }
    if(!board.members.includes(user._id)){
        board.members.push(user._id);
        await board.save();
    }else{
        return next(CustomError(`This user is already a member of (${req.body.slug}) list`,400))
    }

    // Mail gönder
    /*const boardInvitationUrl = "http://putduty.com/invite/token=sdesffsfsw432wefsdfSDFSDF+^rfsdxFSDFSF";

    const emailTemplate = `
        <h2>Board Invation Url</h2>
        <p>This <a href="${boardInvitationUrl}" target="_blank">board invite url</a> is will expire in 1 hour.</p>
    `;

    try {
        await mailHelper({
            from: process.env.SMTP_USER,
            to: req.body.email,
            subject: "Board Invite",
            html: emailTemplate
        })
    } catch (error) {
        return next(new CustomError("Internal Server Error", 500))
    }*/

    res.status(200).json({
        success: true,
        message: "Invitation to Board",
        data: user
    });
    
})

module.exports = { boardCreate, boardList, boardDelete, boardUpdate, boardInvitation }