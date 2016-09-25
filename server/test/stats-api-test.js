var request = require('supertest');
var mongoose = require("mongoose");
var gameRecordSchema = require("../database/game-record-model");
var brogueConstants = require("../brogue/brogue-constants.js");
var expect = require("chai").expect;
var server = require("./server-test");
var config = require("./config-test");

var db = mongoose.createConnection(config.db.url);

describe("stats-api", function(){

    beforeEach(function(done) {

        var gameRecord1 = {
            username: "flend",
            date: new Date("2011-05-26T07:56:00.123Z"),
            score: 100,
            seed: 200,
            level: 3,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a pink jelly on depth 3.",
            recording: "file1"
        };

        var gameRecord2 = {
            username: "flend",
            date: new Date("2011-06-26T07:56:00.123Z"),
            score: 150,
            seed: 250,
            level: 5,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a violent explosion on depth 5.",
            recording: "file2"
        };

        db.model('GameRecord', gameRecordSchema).create([gameRecord1, gameRecord2], function() {
            done();
        });
    });

    afterEach(function(done) {

        //delete all the customer records
        db.model('GameRecord', gameRecordSchema).remove({}, function() {
            done();
        });
    });

    it("returns status 200", function(done) {
      request(server)
          .get("/api/stats/general")
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, done)
    });

    it("totalGames is calculated correctly", function(done) {
        request(server)
            .get("/api/stats/general")
            .set('Accept', 'application/json')
            .end(function(err, res) {
                var bodyObj = JSON.parse(res.text);
                expect(bodyObj).to.have.property('totalGames', 2);
                done();
            });

    });

});
