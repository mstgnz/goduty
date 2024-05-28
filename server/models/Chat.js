const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    boardID     : { type:Schema.ObjectId, required:true, ref:"Board" },
    userID      : { type:Schema.ObjectId, required:true, ref:"User" },
    message     : { type:String, required:true },
    createdAt   : { type:Date, default:Date.now }
});

module.exports = mongoose.model("Chat", ChatSchema);

/**
 * Tek bir chat ekranı olacak ve tüm board members üyeleri yazışacak
 */