// Main entry point in server side code.  Sets up http server and websocket server and routes

var domain = require("domain");

var config = require("./config");
var util = require("util");
var fs = require("fs");

var mongoose = require("mongoose");
mongoose.connect(config.db.url);

// Http Server Configuration
httpServerDomain = domain.create();
httpServerDomain.on("error", function (err) {
    util.log("Uncaught exception emitted internally from Http Server. Process Terminating.");
    console.log(err.stack);
    process.exit(1);
});

httpServerDomain.run(function () {

    var express = require("express");
    var morgan = require("morgan");
    var highScoreApi = require("./api/high-score-api");
    var newsApi = require("./api/news-api");

    var app = express();

    app.use(express.static(config.path.CLIENT_DIR));

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
        res.sendFile(config.path.CLIENT_DIR + "/index.html");
    });

    highScoreApi(app);
    newsApi(app);

    var server = require('http').Server(app);
    var io = require('socket.io')(server);

    server.listen(config.port.HTTP);

    io.on('connection', function (socket) {

        //console.log("New connection");

        var controllerFactory = require("./controllers/controller-factory");
        var controllerCleanUp = require("./controllers/cleanup-controllers.js");
        var Router = require("./controllers/router");

        var controllers = controllerFactory(socket, [
            "error",
            "lobby",
            "authentication",
            "saved-games",
            "brogue",
            "chat"
        ]);

        var router = new Router(controllers);

        socket.on("message", function (message) {
            router.route(message);
            //console.log("Message: " + JSON.stringify(message));
        });

        socket.on("disconnect", function (code, message) {
            controllerCleanUp(controllers);
        });

        socket.on("error", function (err) {
            util.log('Error emitted internally from web socket instance: ' + err);
        });
    });
});
