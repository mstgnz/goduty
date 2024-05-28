const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const TaskSchema = new Schema({
    boardID     : { type:Schema.ObjectId, ref:"Board", required:[true ,"Please provide a board"] },
    parent      : { type:Schema.ObjectId, ref:"Task" },
    title       : { type:String, required:[true ,"Please provide a task title"] },
    slug        : { type:String, unique:true, slug:"title" },
    description : { type:String, required:[true ,"Please provide a description"] },
    labels      : [{ type:String }], // uppercase
    flag        : [{ type:String, default:"Normal", enum:["Normal","Mid","Hight","Urgent","Blocker"] }],
    type        : [{ type:String, default:"Task", enum:["Task","Bug"] }],
    column      : [{ type:String, default:"BACKLOG", enum:["BACKLOG","TODO","BUG","PROGRESS","TEST","DONE","ARCHIVE"] }],
    startDate   : { type:Date },
    finishDate  : { type:Date },
    founder     : { type:Schema.ObjectId, ref:"User", required:[true ,"Please provide a user id"] },
    assignee    : { type:Schema.ObjectId, ref:"User" },
    comments    : [{
        userID  : { type:Schema.ObjectId, ref:"User" },
        comment : { type:String, required:[true ,"Please provide a comment"] }
    }],
    position    : { type:Number, default:1 },
    status      : { type:Boolean, default:true },
    createdAt   : { type:Date, default:Date.now }
});

module.exports = mongoose.model("Task", TaskSchema);

/**
 * 
 * kart title ve description alanlarını sadece founder yani kartı açan kişi set edebilir.
 * 
 * bayrak ve type (flag and type) ekleme sadece founder kartı açan kişi yapabilir.
 * 
 * assignee atamasını kimse yapamaz (founder hariç), sadece işi yapacak olan kişi kendi katılabilir.
 * kartla ilgili başlangıç ve bitiş tarihi board type kanban ise set edilebilir, scrum ise set edilemez.
 * kartla ilgili başlangıç ve bitiş tarihi sadece assignee yani işi yapacak olan kişi set edebilir.
 * 
 * kartı başka bir listeye taşıma işlemini sadece founder ve assignee yapabilir
 * 
 * subtask sadece assignee işi yapacak olan kişi ekleyebilir.
 * subtask bitiş tarihleri base taskın bitiş tarihini set eder
 * 
 * Hiç bir kart silinemeyecek (admin hariç) sadece arşivlenecektir. bknz arşiv listesi (archive)
 * arşive atmayı ise sadece founder ve assignee yapabilir
 * 
 */