const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new Schema({
    description : { type:String, required:[true ,"Please provide a description"] },
    createdAt   : { type:Date, default:Date.now }
});

module.exports = mongoose.model("Log", LogSchema);