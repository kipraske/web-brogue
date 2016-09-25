var request = require('supertest');
var mongoose = require("mongoose");
var gameRecordSchema = require("../database/game-record-model");
var brogueConstants = require("../brogue/brogue-constants.js");
var expect = require("chai").expect;
var server = require("./server-test");

var dbPath = 'mongodb://localhost/stats_api_test';
var db = mongoose.createConnection(dbPath);

describe("stats-api", function(){

    beforeEach(function(done){

        var gameRecord1 = {
            username: "flend",
            date: new Date("2011-05-26T07:56:00.123Z"),
            score: 100,
            seed: 200,
            level: 3,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a pink jelly on depth 6.",
            recording: "file1"
        };

        db.model('GameRecord', gameRecordSchema).create(gameRecord1, function() {
            console.log("wrote record");
            done();
        });
    });

    afterEach(function(done){

        //delete all the customer records
        db.model('GameRecord', gameRecordSchema).remove({}, function() {
            console.log("deleted record");

            done();
        });
    });

    it("returns status 200", function(done) {
      request(server)
          .get("/api/stats/general")
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
              if (err) throw err;
              console.log(JSON.stringify(res));
              done();
          });
    });

});
