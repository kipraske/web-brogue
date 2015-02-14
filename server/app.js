var config = require("./config");

var express = require("express");
var app = express();

var mongoose = require("mongoose");
mongoose.connect(config.db.url);

// TODO - may want to do something similar for session configuration.  First things first - websocket

// Http Server Configuration
app.use(express.static(config.CLIENT_DIR));

//routes
app.get("/", function (req, res) {
    res.sendFile(config.CLIENT_DIR + "/index.html");
});

httpServer = app.listen(80, function () {
    var port = httpServer.address().port;
    console.log("Server listening on port %s", port);
});

// Web Socket Server
var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({server: httpServer});

var controllerFactory = require("./controllers/controller-factory")
var controllerCleanUp = require("./controllers/cleanup-controllers.js");
var Router = require("./controllers/router");

wss.on("connection", function (ws) {

    var controllers = controllerFactory(ws, [
        "error",
        "lobby",
        "authentication",
        "saved-games",
        "brogue"
    ]);

    var router = new Router(controllers);

    ws.on("message", function (message) {
        router.route(message);
    });

    ws.on("close", function (code, message) {
        controllerCleanUp(controllers);
    });
});