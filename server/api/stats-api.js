var mongoose = require('mongoose');
var GameRecord = require("../database/game-record-model");

var brogueConstants = require('../brogue/brogue-constants.js');
var stats = require('../stats/stats.js');
var _ = require("underscore");

module.exports = function(app, config) {

    app.get("/api/stats/levels/monsters", function (req, res) {

        var maxCausesPerLevel = Number.MAX_SAFE_INTEGER;

        if(req.query.maxCauses) {
            maxCausesPerLevel = req.query.maxCauses;
        }

        var variant = config.variants[0];
        if(req.query.variant) {
            variant = req.query.variant;
        }

        res.format({
            json: function () {
                GameRecord.find({}).lean().exec(function (err, games) {

                    var filteredGames = stats.filterForValidGames(games, variant, config.variants[0]);
                    var allNormalModeGames = _.filter(filteredGames, function(game) { return game.easyMode != true; });

                    var allDeathGamesWithCause = stats.deathGamesWithCauses(allNormalModeGames);

                    var deathGamesByLevel = _.groupBy(allDeathGamesWithCause, "level");

                    var deathNumbersByLevel = _.mapObject(deathGamesByLevel, function(levelGames, level) {

                        var deathsByCauseOnLevel = _.groupBy(levelGames, "cause");

                        var numberOfDeathsByCauseOnLevel = _.mapObject(deathsByCauseOnLevel, function(causeGames, thisCause) {
                            return causeGames.length;
                        });

                        var numberOfDeathsByCauseOnLevelAsArray = _.map(numberOfDeathsByCauseOnLevel, function(value, key) {
                            return { level: parseInt(level), cause : key, frequency : parseInt(value), percentage: parseInt(value) / levelGames.length * 100 };
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

    app.get("/api/stats/levels", function (req, res) {

        var variant = config.variants[0];
        if(req.query.variant) {
            variant = req.query.variant;
        }

        res.format({
            json: function () {
                GameRecord.find({}).lean().exec(function (err, games) {

                    var filteredGames = stats.filterForValidGames(games, variant, config.variants[0]);
                    var allNormalModeGames = _.filter(filteredGames, function(game) { return game.easyMode != true; });

                    var allDeathGamesWithCause = stats.deathGamesWithCauses(allNormalModeGames);

                    var deathGamesByLevel = _.groupBy(allDeathGamesWithCause, "level");

                    var deathNumbersByLevel = _.mapObject(deathGamesByLevel, function(levelGames, level) {

                        var numberOfDeathsOnLevelAsArray = { level: parseInt(level), frequency : levelGames.length };

                        return numberOfDeathsOnLevelAsArray;
                    });

                    var deathNumbersFlattened = _.flatten(_.map(deathNumbersByLevel, function(val) { return val; }));

                    res.json(deathNumbersFlattened);
                });
            }
        });
    });

    app.get("/api/stats/levelProbability", function (req, res) {

        var variant = config.variants[0];
        if(req.query.variant) {
            variant = req.query.variant;
        }

        res.format({
            json: function () {
                GameRecord.find({}).lean().exec(function (err, games) {

                    //To calculate the difficulty, we work out the conditional probability of dying on each level
                    //Quits are excluded
                    //Victories are excluded from the deaths, but included in the total number of games to normalise the probability

                    var filteredGames = stats.filterForValidGames(games, variant, config.variants[0]);

                    var allNormalModeGames = _.filter(filteredGames, function(game) { return game.easyMode != true; });
                    var allNormalModeGamesExcludingQuits = _.reject(allNormalModeGames, function(game) { return game.result == brogueConstants.gameOver.GAMEOVER_QUIT });
                    var allNormalModeGamesExcludingQuitsAndVictories = _.reject(allNormalModeGamesExcludingQuits,
                        function(game) { return game.result == brogueConstants.gameOver.GAMEOVER_VICTORY || game.result == brogueConstants.gameOver.GAMEOVER_SUPERVICTORY });

                    if(allNormalModeGamesExcludingQuitsAndVictories.length == 0) {
                        res.json({});
                        return;
                    }

                    var deathGamesByLevel = _.groupBy(allNormalModeGamesExcludingQuitsAndVictories, "level");

                    var deathNumbersByLevel = _.mapObject(deathGamesByLevel, function(levelGames, level) {

                        var numberOfDeathsOnLevelAsArray = { level: parseInt(level), frequency : levelGames.length };

                        return numberOfDeathsOnLevelAsArray;
                    });

                    var deathNumbersFlattened = _.flatten(_.map(deathNumbersByLevel, function(val) { return val; }));

                    var totalGames = allNormalModeGamesExcludingQuits.length;

                    var deathsSortedByLevel = _.sortBy(deathNumbersFlattened, 'level');
                    var levelsToConsider = _.pluck(deathsSortedByLevel, 'level');

                    var conditionalProbabilities = {};

                    _.each(levelsToConsider, function (l) {
                        var deathsOnThisLevel = deathNumbersByLevel[l.toString()];

                        var baseProbability = deathsOnThisLevel.frequency / totalGames;
                        var scaling = 1.0;

                        var levelsBelowThisOne = _.filter(levelsToConsider, function(nl) { return nl < l });

                        _.each(levelsBelowThisOne, function(lt) {
                            scaling = scaling * (1 -  conditionalProbabilities[lt]);
                        });


                        conditionalProbabilities[l] = baseProbability / scaling;
                    });

                    var probabilitiesForLevels = _.mapObject(conditionalProbabilities, function(prob, level) {
                        var probabilityForLevel = { level: parseInt(level), probability : prob };

                        return probabilityForLevel;
                    });

                    var probabilitiesFlattened = _.flatten(_.map(probabilitiesForLevels, function(val) { return val; }));

                    res.json(probabilitiesFlattened);
                });
            }
        });
    });

    app.get("/api/stats/general", function (req, res) {

        var variant = config.variants[0];
        if(req.query.variant) {
            variant = req.query.variant;
        }

        res.format({
            json: function () {
                GameRecord.find({}).lean().exec(function (err, games) {

                    var filteredGames = stats.filterForValidGames(games, variant, config.variants[0]);

                    var allEasyModeGames = _.where(filteredGames, {easyMode: true});
                    var allNormalModeGames = _.filter(filteredGames, function(game) { return game.easyMode != true; });

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

                    var totalLevelsPerGame = _.map(filteredGames, function (game) { return parseInt(game.level) || 0 });
                    var totalLevels = _.reduce(totalLevelsPerGame, function(memo, num){ return memo + num; }, 0);

                    var allVictories = allNormalModeVictories.concat(allNormalModeSuperVictories);
                    var allVictoriesSortedByDate = _.sortBy(allVictories, 'date');
                    var lastVictory = _.last(allVictoriesSortedByDate);
                    var lastVictoryData;
                    if(!lastVictory) {
                        lastVictoryData = { date: "Never", username: "No-one" };
                    }
                    else {
                        lastVictoryData = { date: lastVictory.date, username: lastVictory.username };
                    }

                    var statsSummary = {};

                    statsSummary.totalGames = filteredGames.length;

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

                    statsSummary.lastVictory = lastVictoryData;

                    res.json(statsSummary);
                });
            }
        });
    });
};