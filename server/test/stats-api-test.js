var request = require('supertest');
var mongoose = require("mongoose");
var gameRecord = require("../database/game-record-model");
var brogueConstants = require("../brogue/brogue-constants.js");
var expect = require("chai").expect;
var server = require("./server-test");
var config = require("./config-test");

var db = mongoose.createConnection(config.db.url);

describe("stats/general", function(){

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

        var gameRecord3 = {
            username: "ccc",
            date: new Date("2013-06-27T07:56:01.123Z"),
            score: 150,
            seed: 250,
            level: 26,
            result: brogueConstants.gameOver.GAMEOVER_VICTORY,
            easyMode: false,
            description: "Escaped the Dungeons of Doom with 3 lumenstones!",
            recording: "file3"
        };

        var gameRecord4 = {
            username: "dave",
            date: new Date("2012-06-26T07:56:01.123Z"),
            score: 150,
            seed: 250,
            level: 26,
            result: brogueConstants.gameOver.GAMEOVER_VICTORY,
            easyMode: false,
            description: "Escaped the Dungeons of Doom!",
            recording: "file4"
        };

        gameRecord.create([gameRecord1, gameRecord2, gameRecord3, gameRecord4], function() {
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
                expect(bodyObj).to.have.property('totalGames', 4);
                done();
            });
    });

    it("last victory is calculated from victories", function(done) {
        request(server)
            .get("/api/stats/general")
            .set('Accept', 'application/json')
            .end(function(err, res) {
                var bodyObj = JSON.parse(res.text);
                expect(bodyObj).to.have.deep.property('lastVictory.date', "2013-06-27T07:56:01.123Z");
                expect(bodyObj).to.have.deep.property('lastVictory.username', "ccc");
                done();
            });
    });
});

describe("stats/general filters by variant", function() {

    beforeEach(function (done) {

        var gameRecord1 = {
            username: "flend",
            date: new Date("2011-05-26T07:56:00.123Z"),
            score: 100,
            seed: 200,
            level: 3,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a pink jelly on depth 3.",
            recording: "file1",
            variant: "BROGUE"
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
            recording: "file2",
            variant: "BROGUE"
        };

        var gameRecord3 = {
            username: "ccc",
            date: new Date("2013-06-27T07:56:01.123Z"),
            score: 150,
            seed: 250,
            level: 26,
            result: brogueConstants.gameOver.GAMEOVER_VICTORY,
            easyMode: false,
            description: "Escaped the Dungeons of Doom with 3 lumenstones!",
            recording: "file3",
            variant: "GBROGUE"
        };

        var gameRecord4 = {
            username: "dave",
            date: new Date("2012-06-26T07:56:01.123Z"),
            score: 150,
            seed: 250,
            level: 26,
            result: brogueConstants.gameOver.GAMEOVER_VICTORY,
            easyMode: false,
            description: "Escaped the Dungeons of Doom!",
            recording: "file4",
            variant: "GBROGUE"
        };

        gameRecord.create([gameRecord1, gameRecord2, gameRecord3, gameRecord4], function () {
            done();
        });
    });

    afterEach(function (done) {

        gameRecord.remove({}, function () {
            done();
        });
    });

    it("totalGames is calculated correctly when filtering", function (done) {
        request(server)
            .get("/api/stats/general")
            .set('Accept', 'application/json')
            .query({ variant: 'BROGUE' })
            .end(function (err, res) {
                var bodyObj = JSON.parse(res.text);
                expect(bodyObj).to.have.property('totalGames', 2);
                done();
            });
    });
});

describe("stats/general", function(){

    beforeEach(function(done) {

        var gameRecord1 = {
            username: "xxx",
            date: new Date("2011-06-26T07:56:00.123Z"),
            score: 100,
            seed: 200,
            level: 26,
            result: brogueConstants.gameOver.GAMEOVER_VICTORY,
            easyMode: false,
            description: "Escaped the Dungeons of Doom!",
            recording: "file1"
        };

        var gameRecord2 = {
            username: "yyy",
            date: new Date("2011-05-26T07:56:00.123Z"),
            score: 150,
            seed: 250,
            level: 40,
            result: brogueConstants.gameOver.GAMEOVER_SUPERVICTORY,
            easyMode: false,
            description: "Mastered the Dungeons of Doom!",
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

    it("last victory is calculated from victories and supervictories", function(done) {
        request(server)
            .get("/api/stats/general")
            .set('Accept', 'application/json')
            .end(function(err, res) {
                var bodyObj = JSON.parse(res.text);
                expect(bodyObj).to.have.deep.property('lastVictory.date', "2011-06-26T07:56:00.123Z");
                expect(bodyObj).to.have.deep.property('lastVictory.username', "xxx");
                done();
            });
    });
});

describe("stats/general", function(){

    it("last victory is 'Never' if no victories recorded", function(done) {
        request(server)
            .get("/api/stats/general")
            .set('Accept', 'application/json')
            .end(function(err, res) {
                var bodyObj = JSON.parse(res.text);
                expect(bodyObj).to.have.deep.property('lastVictory.date', 'Never');
                expect(bodyObj).to.have.deep.property('lastVictory.username', 'No-one');
                done();
            });
    });
});


describe("stats/levels/monsters", function() {

    beforeEach(function (done) {

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

        var gameRecord3 = {
            username: "ccc",
            date: new Date("2011-06-27T07:56:00.123Z"),
            score: 151,
            seed: 251,
            level: 1,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a rat on depth 1.",
            recording: "file3"
        };

        var gameRecord4 = {
            username: "ccc2",
            date: new Date("2012-06-27T07:56:00.123Z"),
            score: 152,
            seed: 252,
            level: 1,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a rat on depth 1.",
            recording: "file4"
        };

        var gameRecord5 = {
            username: "ccc3",
            date: new Date("2013-06-27T07:56:00.123Z"),
            score: 153,
            seed: 353,
            level: 1,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a jackal on depth 1.",
            recording: "file5"
        };

        gameRecord.create([gameRecord1, gameRecord2, gameRecord3, gameRecord4, gameRecord5], function () {
            done();
        });
    });

    afterEach(function (done) {

        //delete all the customer records
        gameRecord.remove({}, function () {
            done();
        });
    });

    it("returns status 200", function (done) {
        request(server)
            .get("/api/stats/levels/monsters")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
    });

    it("groups causes by deaths correctly", function (done) {
        request(server)
            .get("/api/stats/levels/monsters")
            .set('Accept', 'application/json')
            .end(function (err, res) {
                var bodyObj = JSON.parse(res.text);

                var level1TopDeath = bodyObj[0];
                expect(level1TopDeath).to.have.property('level', 1);
                expect(level1TopDeath).to.have.property('cause', 'rat');
                expect(level1TopDeath).to.have.property('frequency', 2);
                expect(level1TopDeath).to.have.property('rank', 1);

                var level1SecoundDeath = bodyObj[1];
                expect(level1SecoundDeath).to.have.property('level', 1);
                expect(level1SecoundDeath).to.have.property('cause', 'jackal');
                expect(level1SecoundDeath).to.have.property('frequency', 1);
                expect(level1SecoundDeath).to.have.property('rank', 2);
                done();
            });
    });

    it("restricts records per level by maxCauses", function (done) {
        request(server)
            .get("/api/stats/levels/monsters?maxCauses=1")
            .set('Accept', 'application/json')
            .end(function (err, res) {
                var bodyObj = JSON.parse(res.text);

                var level1TopDeath = bodyObj[0];
                expect(level1TopDeath).to.have.property('level', 1);
                expect(level1TopDeath).to.have.property('cause', 'rat');
                expect(level1TopDeath).to.have.property('frequency', 2);
                expect(level1TopDeath).to.have.property('rank', 1);

                var level3TopDeath = bodyObj[1];
                expect(level3TopDeath).to.have.property('level', 3);
                expect(level3TopDeath).to.have.property('cause', 'pink jelly');
                expect(level3TopDeath).to.have.property('frequency', 1);
                expect(level3TopDeath).to.have.property('rank', 1);
                done();
            });
    });

    it("calculates percentages of all deaths", function (done) {
        request(server)
            .get("/api/stats/levels/monsters?maxCauses=2")
            .set('Accept', 'application/json')
            .end(function (err, res) {
                var bodyObj = JSON.parse(res.text);

                var level1TopDeath = bodyObj[0];
                expect(level1TopDeath).to.have.property('level', 1);
                expect(level1TopDeath).to.have.property('cause', 'rat');
                expect(level1TopDeath).to.have.property('frequency', 2);
                expect(level1TopDeath).to.have.property('percentage').closeTo(66.7, 0.1);
                expect(level1TopDeath).to.have.property('rank', 1);

                var level1SecondDeath = bodyObj[1];
                expect(level1SecondDeath).to.have.property('level', 1);
                expect(level1SecondDeath).to.have.property('cause', 'jackal');
                expect(level1SecondDeath).to.have.property('frequency', 1);
                expect(level1SecondDeath).to.have.property('percentage').closeTo(33.3, 0.1);
                expect(level1SecondDeath).to.have.property('rank', 2);

                var level3TopDeath = bodyObj[2];
                expect(level3TopDeath).to.have.property('level', 3);
                expect(level3TopDeath).to.have.property('cause', 'pink jelly');
                expect(level3TopDeath).to.have.property('frequency', 1);
                expect(level3TopDeath).to.have.property('percentage', 100);
                expect(level3TopDeath).to.have.property('rank', 1);
                done();
            });
    });
});

describe("stats/levelProbabilities", function() {

    beforeEach(function (done) {

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

        var gameRecord3 = {
            username: "ccc",
            date: new Date("2011-06-27T07:56:00.123Z"),
            score: 151,
            seed: 251,
            level: 1,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a rat on depth 1.",
            recording: "file3"
        };

        var gameRecord4 = {
            username: "ccc2",
            date: new Date("2012-06-27T07:56:00.123Z"),
            score: 152,
            seed: 252,
            level: 1,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a rat on depth 1.",
            recording: "file4"
        };

        var gameRecord5 = {
            username: "ccc3",
            date: new Date("2013-06-27T07:56:00.123Z"),
            score: 154,
            seed: 254,
            level: 2,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a jackal on depth 2.",
            recording: "file5"
        };

        var gameRecord6 = {
            username: "ccc3",
            date: new Date("2013-06-28T07:56:00.123Z"),
            score: 153,
            seed: 253,
            level: 2,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a hamster on depth 2.",
            recording: "file6"
        };

        var gameRecord7 = {
            username: "flend",
            date: new Date("2013-06-28T05:56:00.123Z"),
            score: 153,
            seed: 253,
            level: 2,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a violent explosion on depth 2.",
            recording: "file7"
        };

        var gameRecord8 = {
            username: "flend",
            date: new Date("2013-06-29T05:56:00.123Z"),
            score: 154,
            seed: 254,
            level: 3,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a violent explosion on depth 3.",
            recording: "file8"
        };

        var gameRecord9 = {
            username: "flend",
            date: new Date("2012-06-29T05:56:00.123Z"),
            score: 154,
            seed: 254,
            level: 1,
            result: brogueConstants.gameOver.GAMEOVER_VICTORY,
            easyMode: false,
            description: "Escaped the Dungeons of Doom.",
            recording: "file9"
        };

        var gameRecord10 = {
            username: "flend",
            date: new Date("2015-06-29T05:56:00.123Z"),
            score: 154,
            seed: 254,
            level: 40,
            result: brogueConstants.gameOver.GAMEOVER_SUPERVICTORY,
            easyMode: false,
            description: "Mastered the Dungeons of Doom.",
            recording: "file10"
        };

        var gameRecord11 = {
            username: "flend",
            date: new Date("2015-06-29T05:56:22.123Z"),
            score: 154,
            seed: 254,
            level: 1,
            result: brogueConstants.gameOver.GAMEOVER_QUIT,
            easyMode: false,
            description: "Quit on level 1.",
            recording: "file11"
        };

        gameRecord.create([gameRecord1, gameRecord2, gameRecord3, gameRecord4, gameRecord5, gameRecord6, gameRecord7, gameRecord8, gameRecord9, gameRecord10, gameRecord11], function () {
            done();
        });
    });

    afterEach(function (done) {

        //delete all the customer records
        gameRecord.remove({}, function () {
            done();
        });
    });

    it("returns status 200", function (done) {
        request(server)
            .get("/api/stats/levelProbability")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
    });

    it("calculates conditional probabilities", function (done) {
        request(server)
            .get("/api/stats/levelProbability")
            .set('Accept', 'application/json')
            .end(function (err, res) {
                var bodyObj = JSON.parse(res.text);

                var level1Deaths = bodyObj[0];
                expect(level1Deaths).to.have.property('level', 1);
                expect(level1Deaths).to.have.property('probability').closeTo(0.2, 0.01);

                var level2Deaths = bodyObj[1];
                expect(level2Deaths).to.have.property('level', 2);
                expect(level2Deaths).to.have.property('probability').closeTo(0.375, 0.01);

                var level3Deaths = bodyObj[2];
                expect(level3Deaths).to.have.property('level', 3);
                expect(level3Deaths).to.have.property('probability').closeTo(0.4, 0.01);

                var level5Deaths = bodyObj[3];
                expect(level5Deaths).to.have.property('level', 5);
                expect(level5Deaths).to.have.property('probability').closeTo(0.33, 0.01);

                done();
            });
    });
});

describe("stats/levelProbabilities with no game records", function() {


    it("returns status 200", function (done) {
        request(server)
            .get("/api/stats/levelProbability")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
    });
});

describe("stats/levels", function() {

    beforeEach(function (done) {

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

        var gameRecord3 = {
            username: "ccc",
            date: new Date("2011-06-27T07:56:00.123Z"),
            score: 151,
            seed: 251,
            level: 1,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a rat on depth 1.",
            recording: "file3"
        };

        var gameRecord4 = {
            username: "ccc2",
            date: new Date("2012-06-27T07:56:00.123Z"),
            score: 152,
            seed: 252,
            level: 1,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a rat on depth 1.",
            recording: "file4"
        };

        var gameRecord5 = {
            username: "ccc3",
            date: new Date("2013-06-27T07:56:00.123Z"),
            score: 154,
            seed: 254,
            level: 2,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a jackal on depth 2.",
            recording: "file5"
        };

        var gameRecord6 = {
            username: "ccc3",
            date: new Date("2013-06-28T07:56:00.123Z"),
            score: 153,
            seed: 253,
            level: 2,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a hamster on depth 2.",
            recording: "file6"
        };

        var gameRecord7 = {
            username: "flend",
            date: new Date("2013-06-28T05:56:00.123Z"),
            score: 153,
            seed: 253,
            level: 2,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a violent explosion on depth 2.",
            recording: "file7"
        };

        var gameRecord8 = {
            username: "flend",
            date: new Date("2013-05-28T05:56:00.123Z"),
            score: 253,
            seed: 253,
            level: 20,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: true,
            description: "Killed by a violent explosion on depth 20.",
            recording: "file7"
        };

        gameRecord.create([gameRecord1, gameRecord2, gameRecord3, gameRecord4, gameRecord5, gameRecord6, gameRecord7, gameRecord8], function () {
            done();
        });
    });

    afterEach(function (done) {

        //delete all the customer records
        gameRecord.remove({}, function () {
            done();
        });
    });

    it("returns status 200", function (done) {
        request(server)
            .get("/api/stats/levels")
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
    });

    it("groups deaths by level", function (done) {
        request(server)
            .get("/api/stats/levels")
            .set('Accept', 'application/json')
            .end(function (err, res) {
                var bodyObj = JSON.parse(res.text);

                var level1Deaths = bodyObj[0];
                expect(level1Deaths).to.have.property('level', 1);
                expect(level1Deaths).to.have.property('frequency', 2);

                var level2Deaths = bodyObj[1];
                expect(level2Deaths).to.have.property('level', 2);
                expect(level2Deaths).to.have.property('frequency', 3);

                var level3Deaths = bodyObj[2];
                expect(level3Deaths).to.have.property('level', 3);
                expect(level3Deaths).to.have.property('frequency', 1);

                var level5Deaths = bodyObj[3];
                expect(level5Deaths).to.have.property('level', 5);
                expect(level5Deaths).to.have.property('frequency', 1);

                done();
            });
    });
});