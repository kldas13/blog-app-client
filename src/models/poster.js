const mongoose = require('mongoose');

//  Your code goes here

const objectID = mongoose.Types.objectID;

const posterSchema = mongoose.Schema({
    Email : String,
    password : String,
    confirmpassword : String
}, {timestamps : true})

const posterModel = mongoose.model('poster', posterSchema)


module.exports = posterModel;


