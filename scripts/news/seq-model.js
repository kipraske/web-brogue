var mongoose = require('mongoose');

var seqSchema = mongoose.Schema({
    _id: String,
    seq: Number
});

module.exports = mongoose.model('Counters', seqSchema);