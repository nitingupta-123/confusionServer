const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var passortLocalMongoose = require('passport-local-mongoose');



var User = new Schema({
  firstname: {
    type: String,
      default: ''
  },
  lastname: {
    type: String,
      default: ''
  },
  admin:   {
      type: Boolean,
      default: false
  }
});

User.plugin(passortLocalMongoose);

module.exports= mongoose.model('User', User);


