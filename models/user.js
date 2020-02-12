var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    email : {type:String, require:true},
    firstName: {type:String, require:true},
    lastName: {type:String, require:true},
    password:{type:String, require:true},
    publicKey:{type:String, require:false},
    creation_dt:{type:Date, require:true}
});

module.exports = mongoose.model('User',schema)
