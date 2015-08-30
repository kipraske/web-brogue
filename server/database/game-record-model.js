var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var gameRecordSchema = mongoose.Schema({
    username: String,
    date: { type: Date, default: Date.now },
    seed: Number,
    score: String,
    result: Number,
    description: String
});

gameRecordSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('GameRecord', gameRecordSchema);
