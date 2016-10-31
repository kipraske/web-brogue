var mongoose = require('mongoose');

var chatRecordSchema = mongoose.Schema({
    date: { type: Date, default: Date.now },
    username: String,
    message: String
});

module.exports = mongoose.model('ChatRecord', chatRecordSchema);
