var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var bcrypt = require('bcrypt');

var schema = new Schema({
    email : {type:String, require:true},
    firstName: {type:String, require:true},
    lastName: {type:String, require:true},
    password:{type:String, require:true},
    publicKey:{type:String, require:false},
    creation_dt:{type:Date, require:true}
});


// schema.statics.hashPassword = function hashPassword(password){
//     return bcrypt.hashSync(password,10);
// }

// schema.methods.isValid = function(hashedpassword){
//     return  bcrypt.compareSync(hashedpassword, this.password);
// }



module.exports = mongoose.model('User',schema)
