// Main entry point in server side code.  Sets up http server and websocket server and routes

var config = require("./config");

var express = require("express");
var app = express();

var mongoose = require("mongoose");
mongoose.connect(config.db.url);

// Http Server Configuration
app.use(express.static(config.CLIENT_DIR));

// TODO - configure cookie session, the value is saved in the db, we just need to hook it up

//routes
app.get("/", function (req, res) {
    res.sendFile(config.CLIENT_DIR + "/index.html");
});

httpServer = app.listen(config.SERVER_PORT, function () {
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