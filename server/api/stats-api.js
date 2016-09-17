var GameRecord = require("../database/game-record-model");
var _ = require("underscore");

module.exports = function(app) {

    var calculateLevelStats = function () {

        console.log("Calculating level stats");

        GameRecord.find({}).lean().exec(function (err, games) {

            var monsterDeathGames = _.filter(games, function (game) {
                return game.description && game.description.search("Killed") != -1;
            });

            var burnedDeathGames = _.filter(games, function (game) {
                return game.description && game.description.search("Burned") != -1;
            });

            var monsterDeathGamesWithCause = _.map(monsterDeathGames, function (game) {

                var monsterRe = new RegExp("by\\s+an?\\s+(.*?)\\s+on");
                var descriptionMatch = monsterRe.exec(game.description);
                if (descriptionMatch) {
                    game["cause"] = descriptionMatch[1];
                }

                return game;
            });

            var burnedDeathGamesWithCause = _.map(burnedDeathGames, function(game) {
                game["cause"] = "Burned to death";
                return game;
            });

            var allDeathGamesWithCause = monsterDeathGamesWithCause.concat(burnedDeathGamesWithCause);

            var deathGamesByLevel = _.groupBy(allDeathGamesWithCause, "level");

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
        });
    };

    app.get("/api/stats/levels", function (req, res) {

        return res;
    });
};