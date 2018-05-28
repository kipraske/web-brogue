var mongoose = require('mongoose');
var GameRecord = require("../database/game-record-model");
var paginate = require("express-paginate");
var _ = require("underscore");

module.exports = function(app, config) {

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

            filteredGameRecords.push(filteredRecord);
        });

        return filteredGameRecords;
    };

    app.use(paginate.middleware(10, 50));

    app.get("/api/games", function (req, res) {

        var query = {};
        if(req.query.variant) {
            query = { 'variant': req.query.variant };
        }

        GameRecord.paginate(query, {
            page: req.query.page,
            limit: req.query.limit,
            sortBy: sortFromQueryParams(req, '-date')
        }, function (err, gameRecords, pageCount, itemCount) {

            if (err) return next(err);

            res.format({
                json: function () {

                    var gameRecordsFiltered = filterGameRecords(gameRecords);

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

        var query = {
            date: {
                $gte: startTime,
                $lt: endTime
            },
            easyMode: false,
            score: {
                $gt: 0
            }
        };

        if(req.query.variant) {
            query['variant'] = req.query.variant;
        }

        GameRecord.paginate(
            query,
            {   page: req.query.page,
                limit: req.query.limit,
                sortBy: sortFromQueryParams(req, '-score')
        }, function (err, gameRecords, pageCount, itemCount) {

            if (err) return next(err);

            var gameRecordsFiltered = filterGameRecords(gameRecords);

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

        var query = {username: req.params.username};

        if(req.query.variant) {
            query['variant'] = req.query.variant;
        }

        GameRecord.paginate(query, {
            page: req.query.page,
            limit: req.query.limit,
            sortBy: sortFromQueryParams(req, '-date')
        }, function (err, gameRecords, pageCount, itemCount) {

            if (err) return next(err);

            var gameRecordsFiltered = filterGameRecords(gameRecords);

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