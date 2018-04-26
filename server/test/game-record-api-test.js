var request = require('supertest');
var mongoose = require("mongoose");
var gameRecord = require("../database/game-record-model");
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
            date: new Date("2012-05-26T07:56:00.123Z"),
            score: 100,
            seed: 200,
            level: 3,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a pink jelly on depth 3.",
            recording: "file1",
            variant: "GBROGUE"
        };

        var gameRecord2 = {
            username: "ccc",
            date: new Date("2011-05-26T07:56:00.123Z"),
            score: 1003,
            seed: 2002,
            level: 5,
            result: brogueConstants.gameOver.GAMEOVER_VICTORY,
            easyMode: false,
            description: "Escaped.",
            recording: "file2"
        };

        gameRecord.create([gameRecord1, gameRecord2], function() {
            done();
        });
    });

    afterEach(function(done) {

        gameRecord.remove({}, function() {
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
                expect(gameData[0]).to.have.property('recording', 'recording-' + gameData[0]._id);
                done();
            });
    });

    it("returns multiple games", function(done) {
        request(server)
            .get("/api/games")
            .set('Accept', 'application/json')
            .end(function(err, res) {
                var resText = JSON.parse(res.text);
                var gameData = resText.data;
                assert.lengthOf(gameData, 2);
                expect(gameData[0]).to.have.property('username', 'flend');
                expect(gameData[1]).to.have.property('username', 'ccc');
                done();
            });
    });

    it("defaults to first variant if variant is missing", function(done) {
        request(server)
            .get("/api/games")
            .set('Accept', 'application/json')
            .end(function(err, res) {
                var resText = JSON.parse(res.text);
                var gameData = resText.data;
                expect(gameData[0]).to.have.property('variant', 'GBROGUE');
                expect(gameData[1]).to.have.property('variant', 'BROGUE');
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
                        expect(gameData[0]).to.have.property('date', "2012-05-26T07:56:00.123Z");
                        done();
                    });
            });
    });
});


describe("api/games filtering by variant", function(){

    beforeEach(function(done) {

        var gameRecord1 = {
            username: "flend",
            date: new Date("2012-05-26T07:56:00.123Z"),
            score: 100,
            seed: 200,
            level: 3,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a pink jelly on depth 3.",
            recording: "file1",
            variant: "GBROGUE"
        };

        var gameRecord2 = {
            username: "ccc",
            date: new Date("2011-05-26T07:56:00.123Z"),
            score: 1003,
            seed: 2002,
            level: 5,
            result: brogueConstants.gameOver.GAMEOVER_VICTORY,
            easyMode: false,
            description: "Escaped.",
            recording: "file2",
            variant: "BROGUE"
        };

        var gameRecord3 = {
            username: "cccd",
            date: new Date("2014-05-26T07:56:00.123Z"),
            score: 1004,
            seed: 2005,
            level: 10,
            result: brogueConstants.gameOver.GAMEOVER_VICTORY,
            easyMode: false,
            description: "Escaped.",
            recording: "file3"
        };

        gameRecord.create([gameRecord1, gameRecord2, gameRecord3], function() {
            done();
        });
    });

    afterEach(function(done) {

        gameRecord.remove({}, function() {
            done();
        });
    });

    it("filters games based on variant, assuming default BROGUE", function(done) {
        request(server)
            .get("/api/games")
            .set('Accept', 'application/json')
            .query({ variant: 'BROGUE' })
            .end(function(err, res) {
                var resText = JSON.parse(res.text);
                var gameData = resText.data;
                expect(gameData).to.have.length.of(2);
                expect(gameData[0]).to.have.deep.property('variant', "BROGUE");
                done();
            });
    });

    it("filters games based on non-default variant", function(done) {
        request(server)
            .get("/api/games")
            .set('Accept', 'application/json')
            .query({ variant: 'GBROGUE' })
            .end(function(err, res) {
                var resText = JSON.parse(res.text);
                var gameData = resText.data;
                expect(gameData).to.have.length.of(1);
                expect(gameData[0]).to.have.deep.property('variant', "GBROGUE");
                done();
            });
    });
});