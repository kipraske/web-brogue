var GameRecord = require("../database/game-record-model");
var paginate = require("express-paginate");

module.exports = function(app) {

    app.use(paginate.middleware(10, 50));

    app.get("/api/games", function (req, res) {
        GameRecord.paginate({}, {
            page: req.query.page,
            limit: req.query.limit,
            sortBy: '-date'
        }, function (err, gameRecords, pageCount, itemCount) {

            if (err) return next(err);

            res.format({
                json: function () {
                    // inspired by Stripe's API response for list objects
                    res.json({
                        object: 'list',
                        has_more: paginate.hasNextPages(req)(pageCount),
                        data: gameRecords
                    });
                }
            });
        });
    });

    app.get("/api/games/:username", function (req, res) {

        GameRecord.paginate({username: req.params.username}, {
            page: req.query.page,
            limit: req.query.limit,
            sortBy: '-date'
        }, function (err, gameRecords, pageCount, itemCount) {

            if (err) return next(err);

            res.format({
                json: function () {
                    // inspired by Stripe's API response for list objects
                    res.json({
                        object: 'list',
                        has_more: paginate.hasNextPages(req)(pageCount),
                        data: gameRecords
                    });
                }
            });
        });
    });
};