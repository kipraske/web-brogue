var expect = require("chai").expect;

var brogueConstants = require("../brogue/brogue-constants.js");

var stats = require("../stats/stats.js");

describe("stats.filterForValidGames", function() {

    it("returns valid game records", function () {

        var validGameRecord1 = {
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

        var validGameRecord2 = {
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

        var allValidGameRecords = [validGameRecord1, validGameRecord2];

        var filteredGames = stats.filterForValidGames(allValidGameRecords);

        expect(filteredGames).to.deep.equal(allValidGameRecords);
    });

    it("returns victories recorded with level 0", function () {

        var validGameRecord1 = {
            username: "flend",
            date: new Date("2011-05-26T07:56:00.123Z"),
            score: 100,
            seed: 200,
            level: 0,
            result: brogueConstants.gameOver.GAMEOVER_VICTORY,
            easyMode: false,
            description: "Killed by a pink jelly on depth 3.",
            recording: "file1"
        };

        var validGameRecord2 = {
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

        var allValidGameRecords = [validGameRecord1, validGameRecord2];

        var filteredGames = stats.filterForValidGames(allValidGameRecords);

        expect(filteredGames).to.deep.equal(allValidGameRecords);
    });

    it("removes games with null levels", function () {

        var gameWithNullLevel = {
            username: "flend",
            date: new Date("2011-06-26T07:56:00.123Z"),
            score: 150,
            seed: 250,
            level: null,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a violent explosion on depth 5.",
            recording: "file2"
        };

        var validGameRecord1 = {
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

        var allGameRecords = [gameWithNullLevel, validGameRecord1];

        var filteredGames = stats.filterForValidGames(allGameRecords);

        expect(filteredGames).to.deep.equal([ validGameRecord1 ]);
    });

    it("removes games with undefined levels", function () {

        var gameWithUndefinedLevel = {
            username: "flend",
            date: new Date("2011-06-26T07:56:00.123Z"),
            score: 150,
            seed: 250,
            result: brogueConstants.gameOver.GAMEOVER_DEATH,
            easyMode: false,
            description: "Killed by a violent explosion on depth 5.",
            recording: "file2"
        };

        var validGameRecord1 = {
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

        var allGameRecords = [validGameRecord1, gameWithUndefinedLevel];

        var filteredGames = stats.filterForValidGames(allGameRecords);

        expect(filteredGames).to.deep.equal([ validGameRecord1 ]);
    });
});