var NewsRecord = require("../database/news-model");
var paginate = require("express-paginate");
var _ = require("underscore");

module.exports = function(app) {

    var sortFromQueryParams = function (req, defaultSort) {
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

    var filterNewsRecords = function (newsRecords) {

        var filteredNewsRecords = [];
        var d = new Date();
        var now = d.getTime();

        _.each(newsRecords, function (newsRecord) {

            //Return news from the last month
            if(newsRecord.date.getTime() - now < 1000 * 60 * 60 * 24 * 30 * 1) {
                filteredNewsRecords.push(newsRecord);
            }
        });

        return filteredNewsRecords;
    };

    app.get("/api/news", function (req, res) {
        NewsRecord.paginate({}, {
            page: req.query.page,
            limit: req.query.limit,
            sortBy: sortFromQueryParams(req, '-date')
        }, function (err, newsRecords, pageCount, itemCount) {

            if (err) return next(err);

            res.format({
                json: function () {
                    res.json({
                        object: 'list',
                        data: filterNewsRecords(newsRecords),
                        pageCount: pageCount,
                        itemCount: itemCount
                    });
                }
            });
        });
    });
};