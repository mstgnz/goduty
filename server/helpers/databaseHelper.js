const mongoose = require('mongoose');

const connectMongoose = () => {
    mongoose.connect(process.env.MONGO_URI, { 
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
    .then(()=>{
        console.log("MongoDB connect successfull");
    })
    .catch( err => {
        console.log(err.message);
    })
}

module.exports = connectMongoose;