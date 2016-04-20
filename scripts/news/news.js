var mongoose = require("mongoose");
var config = require("../../server/config");
var async = require("async");

var argv = require('minimist')(process.argv.slice(2));

var SEQ_NAME = "newsrecords";

mongoose.connect(config.db.url);

//This is copied to avoid references to different mongooses
var newsModel = require("./news-model");
var seqModel = require("./seq-model");

if(argv._.length < 2) {
    console.log("Usage: save 'news-to-save'");
    process.exit(1);
}

//Initialise the db if required
async.series([
    function(finished) {
        seqModel.find(function (err, seq) {
            console.log("Found seq: " + JSON.stringify(seq));
            if (err) {
                console.log("Error accessing sequences " + JSON.stringify(err));
                process.exit(1);
            }

            if (seq.length == 0) {
                console.log("Creating new sequence");
                seqModel.create({"_id": SEQ_NAME, "seq": 0 }, function (err) {
                    if (err) {
                        console.log("Error creating initial sequence " + JSON.stringify(err));
                        process.exit(1);
                    }
                    finished();
                })
            }
            else {
                finished();
            }
        });
    },
    function(finished) {

        console.log("step2");

        //This doesn't work and needs to be turned into a working command!

        var query = {"_id": SEQ_NAME};
        var update = {$inc: { seq: 1 }};
        var options = {new: true};

        seqModel.findOneAndUpdate(query, update, options,
            function(err, seq) {

                console.log("Found seq: " + JSON.stringify(seq));

                if(err) {
                    console.log("Error updating sequence " + JSON.stringify(err));
                    process.exit(1);
                }

                var newsStory = {
                    date: new Date(),
                    story: argv._[1],
                    seq: seq.seq
                };

                console.log(JSON.stringify(newsStory));

                newsModel.create(newsStory, function (err) {
                    if (err) {
                        console.log("Error saving story " + JSON.stringify(err));
                    }
                    else {
                        console.log("Wrote story successfully");
                    }

                    finished();
                });
            }
        );
    },
    function() {
        process.exit(0);
    }
]);





