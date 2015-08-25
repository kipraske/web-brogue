var mongoose = require('mongoose');

var gameRecordSchema = mongoose.Schema({
    username: String,
    date: { type: Date, default: Date.now },
    score: String,
    result: Number,
    description: String
});

module.exports = mongoose.model('GameRecord', gameRecordSchema);
