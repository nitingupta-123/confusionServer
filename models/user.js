const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passortLocalMongoose = require('passport-local-mongoose');



const userSchema = new Schema({
    admin:{
        type:Boolean,
        default:false
    }

});

userSchema.plugin(passortLocalMongoose);

module.exports= mongoose.model('User', userSchema);


