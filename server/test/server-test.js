// Lightweight copy of the HTTP server only
// Used for testing. Aim to combine as much as this as possible with the live code

var util = require("util");
var fs = require("fs");
var path = require('path');

var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/stats_api_test');

var express = require("express");
var morgan = require("morgan");
var highScoreApi = require("../api/high-score-api");
var newsApi = require("../api/news-api");
var statsApi = require("../api/stats-api");

var app = express();
var CLIENT_DIR = path.normalize(__dirname + "/../client/");

app.use(express.static(CLIENT_DIR));

var accessLogStream = fs.createWriteStream(__dirname + '/access.log', {flags: 'a'});
app.use(morgan('combined', {stream: accessLogStream}));

/*
 //CORS middleware for testing
 var allowCrossDomain = function(req, res, next) {
 res.header('Access-Control-Allow-Origin', '*');
 res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
 res.header('Access-Control-Allow-Headers', 'Content-Type');

 next();
 };
 app.use(allowCrossDomain);
 */

//routes
app.get("/", function (req, res) {
    res.sendFile(CLIENT_DIR + "/index.html");
});

highScoreApi(app);
newsApi(app);
statsApi(app);

module.exports = app;