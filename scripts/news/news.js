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
    console.log("Usage: delete (seq-no)");
    console.log("Usage: list all");
    process.exit(1);
}

//Initialise the db if required
async.series([
    function(finished) {
        seqModel.find(function (err, seq) {

            if (err) {
                console.log("Error accessing sequences " + JSON.stringify(err));
                process.exit(1);
            }

            if (seq.length == 0) {
                console.log("Creating sequence table");
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

        if(argv._[0] == "save") {

            var query = {"_id": SEQ_NAME};
            var update = {$inc: { seq: 1 }};
            var options = {new: true};

            seqModel.findOneAndUpdate(query, update, options,
                function (err, seq) {

                    if (err) {
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
        }
        else if(argv._[0] == "delete") {

            var query = {"seq": argv._[1]};

            newsModel.findOneAndRemove(query,
                function(err, news) {

                    if (err) {
                        console.log("Unable to delete entry: seq: " + news.seq + ": " + JSON.stringify(err));
                        process.exit(1);
                    }
                    else {
                        console.log("Deleted story with id: " + news.seq);
                    }

                    finished();
                });
        }
        else if(argv._[0] == "list") {

            newsModel.find(query,
                function(err, news) {

                    if (err) {
                        console.log("Unable to find records: " + JSON.stringify(err));
                        process.exit(1);
                    }
                    else {

                        console.log(news);
                    }

                    finished();
                });
        }
        else {
            console.log("Unknown command.");
            finished();
        }
    },
    function() {
        process.exit(0);
    }
]);





