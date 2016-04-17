var mongoose = require("mongoose");
var config = require("../../server/config");
var async = require("async");

var argv = require('minimist')(process.argv.slice(2));

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
            console.log("found");
            if (err) {
                console.log("Error accessing sequences " + JSON.stringify(err));
                process.exit(1);
            }

            console.log(JSON.stringify(seq));

            if (seq.length == 0) {
                console.log("creating new sequence");
                seqModel.create({"_id": "newsrecords"}, function (err) {
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

        console.log("end step 1");
    },
    function(finished) {

        console.log("step2");

        //This doesn't work and needs to be turned into a working command!
        function getNextSequence(name) {
            seqModel.findOneAndUpdate(
                {
                    query: { _id: name },
                    update: { $inc: { seq: 1 } },
                    new: true
                }
            );

            //return ret.seq;
        }

        var newsStory = {
            date: new Date(),
            story: argv._[1],
            seq: 0//getNextSequence("newsrecords")
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
    },
    function() {
        process.exit(0);
    }]);






