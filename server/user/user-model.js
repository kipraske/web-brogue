var mongoose = require('mongoose');
var bCrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    username: String,
    password: String
});

userSchema.methods.isValidPassword = function (password) {
    return bCrypt.compareSync(password, this.password);
};

userSchema.methods.createHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10));
};

module.exports = mongoose.model('User', userSchema);
