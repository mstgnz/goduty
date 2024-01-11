const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SiprintSchema = new Schema({
    boardID     : { type:Schema.ObjectId, required:true, ref:"Board" },
    name        : { type:String, required:true },
    tasks       : [{ type:Schema.ObjectId, ref:"Task" }],
    startDate   : { type:Date },
    endDate     : { type:Date },
    createdAt   : { type:Date, default:Date.now }
});

module.exports = mongoose.model("Siprint", SiprintSchema);