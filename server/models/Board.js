const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const BoardSchema = new Schema({
    title       : { type:String, required:[true ,"Please provide a board title"] },
    slug        : { type:String, unique:true, slug:"title" },
    type        : [{ type:String, default:"Scrum", enum:["Scrum","Kanban"] }],
    founder     : { type:Schema.ObjectId, ref:"User", required:[true ,"Please provide a board founder"] },
    members     : [{ type:Schema.ObjectId, ref:"User" }],
    createdAt   : { type:Date, default:Date.now }
});

module.exports = mongoose.model("Board", BoardSchema);