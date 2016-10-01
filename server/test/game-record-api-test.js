var request = require('supertest');
var mongoose = require("mongoose");
var gameRecordSchema = require("../database/game-record-model");
var brogueConstants = require("../brogue/brogue-constants.js");
var expect = require("chai").expect;
var assert = require("chai").assert;
var server = require("./server-test");
var config = require("./config-test");

var db = mongoose.createConnection(config.db.url);

describe("api/games", function(){

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

        db.model('GameRecord', gameRecordSchema).create([gameRecord1], function() {
            done();
        });
    });

    afterEach(function(done) {

        db.model('GameRecord', gameRecordSchema).remove({}, function() {
            done();
        });
    });

    it("returns status 200", function(done) {
        request(server)
            .get("/api/games")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
    });

    it("returns ids with games", function(done) {
        request(server)
            .get("/api/games")
            .set('Accept', 'application/json')
            .end(function(err, res) {
                var resText = JSON.parse(res.text);
                var gameData = resText.data;
                assert.lengthOf(gameData, 1);
                expect(gameData[0]).to.have.property('_id');
                done();
            });
    });

    it("returns recording IDs (not filenames) with games", function(done) {
        request(server)
            .get("/api/games")
            .set('Accept', 'application/json')
            .end(function(err, res) {
                var resText = JSON.parse(res.text);
                var gameData = resText.data;
                assert.lengthOf(gameData, 1);
                expect(gameData[0]).to.have.property('recording', 'recording-' + gameData[0]._id);
                done();
            });
    });

    it("allows games to be retrieved by ID", function(done) {
        request(server)
            .get("/api/games")
            .set('Accept', 'application/json')
            .end(function(err, res) {
                var resText = JSON.parse(res.text);
                var gameData = resText.data;
                var gameId = gameData[0]._id;

                request(server)
                    .get("/api/games/id/" + gameId)
                    .set('Accept', 'application/json')
                    .end(function(err, res) {

                        var resText = JSON.parse(res.text);
                        var gameData = resText.data;
                        expect(gameData[0]).to.have.property('date', "2011-05-26T07:56:00.123Z");
                        done();
                    });
            });
    });
});
