var mongoose = require("mongoose");
var gameRecord = require("../database/game-record-model");
var brogueConstants = require("../brogue/brogue-constants.js");

mongoose.connect('mongodb://localhost/stats_api_test');

describe("stats-api", function(){

    beforeEach(function(done){

        var gameRecord1 = {
            username: "flend",
            date: event.date,
            score: 100,
            seed: 200,
            level: 3,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a pink jelly on depth 6.",
            recording: "file1"
        };

        gameRecord.create(gameRecord1, function() {
            done();
        });
    });
    afterEach(function(done){
        //delete all the customer records
        gameRecord.remove({}, function() {
            done();
        });
    });

    var url = "http://localhost:8080/api/stats/general";

    it("returns status 200", function() {
      request(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
      });
    });

});
