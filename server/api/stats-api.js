var GameRecord = require("../database/game-record-model");
var brogueConstants = require('../brogue/brogue-constants.js');
var _ = require("underscore");

module.exports = function(app) {

    app.get("/api/stats/levels", function (req, res) {

        var maxCausesPerLevel = Number.MAX_SAFE_INTEGER;
        if(req.query.maxCauses) {
            maxCausesPerLevel = req.query.maxCauses;
        }

        res.format({
            json: function () {
                GameRecord.find({}).lean().exec(function (err, games) {

                    var monsterDeathGames = _.filter(games, function (game) {
                        return game.description && game.description.search("Killed") != -1;
                    });

                    var monsterDeathGamesWithCause = _.map(monsterDeathGames, function (game) {

                        var monsterRe = new RegExp("by\\s+[an]*\\s+(.*?)\\s+on");
                        var descriptionMatch = monsterRe.exec(game.description);
                        if (descriptionMatch) {
                            game["cause"] = descriptionMatch[1];
                        }
                        else {
                            game["cause"] = "unknown";
                        }

                        return game;
                    });

                    var burnedDeathGames = _.filter(games, function (game) {
                        return game.description && game.description.search("Burned") != -1;
                    });

                    var burnedDeathGamesWithCause = _.map(burnedDeathGames, function(game) {
                        game["cause"] = "burned to death";
                        return game;
                    });

                    var poisonedDeathGames = _.filter(games, function (game) {
                        return game.description && game.description.search("poison") != -1;
                    });

                    var poisonedDeathGamesWithCause = _.map(poisonedDeathGames, function(game) {
                        game["cause"] = "poison";
                        return game;
                    });

                    var starvedDeathGames = _.filter(games, function (game) {
                        return game.description && game.description.search("Starved") != -1;
                    });

                    var starvedDeathGamesWithCause = _.map(starvedDeathGames, function(game) {
                        game["cause"] = "starved";
                        return game;
                    });

                    var lavaDeathGames = _.filter(games, function (game) {
                        return game.description && game.description.search("by lava") != -1;
                    });

                    var lavaDeathGamesWithCause = _.map(lavaDeathGames, function(game) {
                        game["cause"] = "lava";
                        return game;
                    });

                    var allDeathGamesWithCause = monsterDeathGamesWithCause
                        .concat(burnedDeathGamesWithCause)
                        .concat(poisonedDeathGamesWithCause)
                        .concat(starvedDeathGamesWithCause)
                        .concat(lavaDeathGamesWithCause);

                    var deathGamesByLevel = _.groupBy(allDeathGamesWithCause, "level");

                    var deathNumbersByLevel = _.mapObject(deathGamesByLevel, function(levelGames, level) {

                        var deathsByCauseOnLevel = _.groupBy(levelGames, "cause");
                        var numberOfDeathsByCauseOnLevel = _.mapObject(deathsByCauseOnLevel, function(causeGames, thisCause) {
                            return causeGames.length;
                        });

                        var numberOfDeathsByCauseOnLevelAsArray = _.map(numberOfDeathsByCauseOnLevel, function(value, key) {
                            return { level: parseInt(level), cause : key, frequency : parseInt(value) };
                        });

                        var numberOfDeathsByCauseOnLevelAsArraySorted = _.sortBy(numberOfDeathsByCauseOnLevelAsArray, "frequency").reverse();
                        var numberOfDeathsByCauseOnLevelAsArraySortedWithRank = _.map(numberOfDeathsByCauseOnLevelAsArraySorted, function(data, index) {
                            return _.extend(data, { rank: index + 1});
                        });

                        return numberOfDeathsByCauseOnLevelAsArraySortedWithRank;
                    });

                    var deathNumbersCropped = _.mapObject(deathNumbersByLevel, function(levelStats) {
                        return levelStats.slice(0, maxCausesPerLevel);
                    });

                    var deathNumbersFlattened = _.flatten(_.map(deathNumbersCropped, function(val) { return val; }));

                    res.json(deathNumbersFlattened);
                });
            }
        });
    });

    app.get("/api/stats/general", function (req, res) {

        var maxCausesPerLevel = Number.MAX_SAFE_INTEGER;
        if(req.query.maxCauses) {
            maxCausesPerLevel = req.query.maxCauses;
        }

        res.format({
            json: function () {
                GameRecord.find({}).lean().exec(function (err, games) {

                    var allEasyModeGames = _.where(games, {easyMode: true});
                    var allNormalModeGames = _.filter(games, function(game) { return game.easyMode != true; });

                    var allEasyModeVictories = _.where(allEasyModeGames, {result: brogueConstants.gameOver.GAMEOVER_VICTORY});
                    var allEasyModeQuits = _.where(allEasyModeGames, {result: brogueConstants.gameOver.GAMEOVER_QUIT});
                    var allEasyModeDeaths = _.where(allEasyModeGames, {result: brogueConstants.gameOver.GAMEOVER_DEATH});
                    var allEasyModeSuperVictories = _.where(allEasyModeGames, {result: brogueConstants.gameOver.GAMEOVER_SUPERVICTORY});

                    var allNormalModeVictories = _.where(allNormalModeGames, {result: brogueConstants.gameOver.GAMEOVER_VICTORY});
                    var allNormalModeQuits = _.where(allNormalModeGames, {result: brogueConstants.gameOver.GAMEOVER_QUIT});
                    var allNormalModeDeaths = _.where(allNormalModeGames, {result: brogueConstants.gameOver.GAMEOVER_DEATH});
                    var allNormalModeSuperVictories = _.where(allNormalModeGames, {result: brogueConstants.gameOver.GAMEOVER_SUPERVICTORY});

                    var totalLumenstonesPerGame = _.map(allNormalModeGames, function (game) {

                        var lumenRe = new RegExp("with\\s+(\\d+)\\s+lumenstones");
                        var descriptionMatch = lumenRe.exec(game.description);
                        if (descriptionMatch) {
                            return parseInt(descriptionMatch[1]) || 0;
                        }
                        else {
                            return 0;
                        }

                        return game;
                    });

                    var totalLumenstones = _.reduce(totalLumenstonesPerGame, function(memo, num){ return memo + num; }, 0);

                    var totalLevelsPerGame = _.map(games, function (game) { return parseInt(game.level) || 0 });
                    var totalLevels = _.reduce(totalLevelsPerGame, function(memo, num){ return memo + num; }, 0);

                    var statsSummary = {};

                    statsSummary.totalGames = games.length;

                    statsSummary.totalEasyModeGames = allEasyModeGames.length;
                    statsSummary.totalNormalModeGames = allNormalModeGames.length;

                    statsSummary.totalEasyModeVictories = allEasyModeVictories.length;
                    statsSummary.totalEasyModeQuits = allEasyModeQuits.length;
                    statsSummary.totalEasyModeDeaths = allEasyModeDeaths.length;
                    statsSummary.totalEasyModeSuperVictories = allEasyModeSuperVictories.length;

                    statsSummary.totalNormalModeVictories = allNormalModeVictories.length;
                    statsSummary.totalNormalModeQuits = allNormalModeQuits.length;
                    statsSummary.totalNormalModeDeaths = allNormalModeDeaths.length;
                    statsSummary.totalNormalModeSuperVictories = allNormalModeSuperVictories.length;

                    statsSummary.totalLumenstones = totalLumenstones;
                    statsSummary.totalLevels = totalLevels;

                    res.json(statsSummary);
                });
            }
        });
    });
};