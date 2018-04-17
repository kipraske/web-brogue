var mongoose = require('mongoose');
var GameRecord = require("../database/game-record-model");
var paginate = require("express-paginate");
var config = require('../config');
var _ = require("underscore");

module.exports = function(app) {

    var sortFromQueryParams = function(req, defaultSort) {
        if (req.query.sort) {
            if (req.query.order && req.query.order === "desc") {
                return "-" + req.query.sort;
            }
            else {
                return req.query.sort;
            }
        }
        else {
            return defaultSort;
        }
    };

    var filterGameRecords = function(gameRecords) {

        var filteredGameRecords = [];

        _.each(gameRecords, function(gameRecord) {

            var filteredRecord =
                _.pick(gameRecord,
                    '_id', 'username', 'score', 'seed', 'level', 'result', 'easyMode', 'description', 'date', 'variant');

            if('recording' in gameRecord && gameRecord.recording != undefined) {
                filteredRecord.recording = 'recording-' + gameRecord._id;
            }

            //Handle games before variants were introduced
            if('variant' in gameRecord && gameRecord.variant == undefined) {
                filteredRecord.variant = config.variants[0];
            }

            filteredGameRecords.push(filteredRecord);
        });

        return filteredGameRecords;
    };

    //Note: assumes gameRecords all have variant set
    var filterGameRecordsByVariant = function(gameRecords, variant) {
        return _.filter(gameRecords, function(gameRecord) {
           return gameRecord.variant === variant;
        });
    };

    app.use(paginate.middleware(10, 50));

    app.get("/api/games", function (req, res) {

        var variantFilter = false;
        if(req.query.variant) {
            variantFilter = req.query.variant;
        }

        GameRecord.paginate({}, {
            page: req.query.page,
            limit: req.query.limit,
            sortBy: sortFromQueryParams(req, '-date')
        }, function (err, gameRecords, pageCount, itemCount) {

            if (err) return next(err);

            res.format({
                json: function () {

                    var gameRecordsFiltered = filterGameRecords(gameRecords);
                    if(variantFilter) {
                        gameRecordsFiltered = filterGameRecordsByVariant(gameRecordsFiltered, variantFilter);
                    }

                    res.json({
                        object: 'list',
                        data: gameRecordsFiltered,
                        pageCount: pageCount,
                        itemCount: itemCount
                    });
                }
            });
        });
    });

    app.get("/api/dailygames", function (req, res) {

        var now = new Date();
        var startTime = now.setUTCHours(0,0,0,0);
        var endTime = now.setUTCHours(24,0,0,0);

        var variantFilter = false;
        if(req.query.variant) {
            variantFilter = req.query.variant;
        }

        GameRecord.paginate(
            {
                date: {
                    $gte: startTime,
                    $lt: endTime
                },
                easyMode: false,
                score: {
                    $gt: 0
                }
            },
            {   page: req.query.page,
                limit: req.query.limit,
                sortBy: sortFromQueryParams(req, '-score')
        }, function (err, gameRecords, pageCount, itemCount) {

            if (err) return next(err);

            var gameRecordsFiltered = filterGameRecords(gameRecords);
            if(variantFilter) {
                gameRecordsFiltered = filterGameRecordsByVariant(gameRecordsFiltered, variantFilter);
            }

            res.format({
                json: function () {
                    res.json({
                        object: 'list',
                        data: gameRecordsFiltered,
                        pageCount: pageCount,
                        itemCount: itemCount
                    });
                }
            });
        });
    });

    app.get("/api/games/:username", function (req, res) {

        var variantFilter = false;
        if(req.query.variant) {
            variantFilter = req.query.variant;
        }

        GameRecord.paginate({username: req.params.username}, {
            page: req.query.page,
            limit: req.query.limit,
            sortBy: sortFromQueryParams(req, '-date')
        }, function (err, gameRecords, pageCount, itemCount) {

            if (err) return next(err);

            var gameRecordsFiltered = filterGameRecords(gameRecords);
            if(variantFilter) {
                gameRecordsFiltered = filterGameRecordsByVariant(gameRecordsFiltered, variantFilter);
            }

            res.format({
                json: function () {
                    res.json({
                        object: 'list',
                        data: gameRecordsFiltered,
                        pageCount: pageCount,
                        itemCount: itemCount
                    });
                }
            });
        });
    });

    app.get("/api/games/id/:id", function (req, res) {

        GameRecord.paginate({_id: req.params.id}, {
            page: req.query.page,
            limit: req.query.limit,
            sortBy: sortFromQueryParams(req, '-date')
        }, function (err, gameRecords, pageCount, itemCount) {

            if (err) return next(err);

            res.format({
                json: function () {
                    res.json({
                        object: 'list',
                        data: filterGameRecords(gameRecords),
                        pageCount: pageCount,
                        itemCount: itemCount
                    });
                }
            });
        });
    });
};