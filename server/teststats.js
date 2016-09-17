var config = require("./config");

var GameRecord = require("./database/game-record-model");
var _ = require("underscore");

var mongoose = require("mongoose");
mongoose.connect(config.db.url);

var calculateLevelStats = function () {

    console.log("Calculating level stats");

    GameRecord.find({}).lean().exec(function (err, games) {

        var monsterDeathGames = _.filter(games, function (game) {
            return game.description && game.description.search("Killed") != -1;
        });

        var noMonsterDeathGames = _.filter(games, function (game) {
            return game.description && game.description.search("Quit") == -1 && game.description.search("Killed") == -1;
        });

        var burnedDeathGames = _.filter(games, function (game) {
            return game.description && game.description.search("Burned") != -1;
        });

        console.log("Records with killed: " + monsterDeathGames.length);

        var monsterDeathGamesWithCause = _.map(monsterDeathGames, function (game) {

           //var monsterRe = new RegExp("by\s+an?\s+(.*?)\s+on");
           var monsterRe = new RegExp("by\\s+an?\\s+(.*?)\\s+on");
           var descriptionMatch = monsterRe.exec(game.description);
            if (descriptionMatch) {
                console.log("match");
                game["cause"] = descriptionMatch[1];
            }
            else {
                console.log("no match");
            }

            return game;
        });

        var burnedDeathGamesWithCause = _.map(burnedDeathGames, function(game) {
            game["cause"] = "Burned to death";
            return game;
        });

        var allDeathGamesWithCause = monsterDeathGamesWithCause.concat(burnedDeathGamesWithCause);

        var deathGamesByLevel = _.groupBy(allDeathGamesWithCause, "level");

        console.log(JSON.stringify(deathGamesByLevel, null, 2));

        var deathNumbersByLevel = _.mapObject(deathGamesByLevel, function(levelGames, level) {

            var deathsByCauseOnLevel = _.groupBy(levelGames, "cause");
            var numberOfDeathsByCauseOnLevel = _.mapObject(deathsByCauseOnLevel, function(causeGames, thisCause) {
              return causeGames.length;
            });

            var numberOfDeathsByCauseOnLevelAsArray = _.map(numberOfDeathsByCauseOnLevel, function(value, key){
                return { cause : key, frequency : value };
            });
            var numberOfDeathsByCauseOnLevelAsArraySorted = _.sortBy(numberOfDeathsByCauseOnLevelAsArray, "frequency").reverse();

            return numberOfDeathsByCauseOnLevelAsArraySorted;
        });

        console.log(JSON.stringify(deathNumbersByLevel, null, 2));

/*
        console.log("Killed Games");
        console.log(JSON.stringify(monsterDeathGamesWithCause, null, 2));

        console.log("Burned Games");
        console.log(JSON.stringify(burnedDeathGamesWithCause, null, 2));
*/

    });
};

calculateLevelStats();

var cat = {};
cat["dog"] = "bob";

console.log(JSON.stringify(cat));