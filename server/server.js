// Main entry point in server side code.  Sets up http server and websocket server and routes

var config = require("./config");

var express = require("express");
var app = express();

var mongoose = require("mongoose");
mongoose.connect(config.db.url);

// Http Server Configuration
app.use(express.static(config.path.CLIENT_DIR));

// TODO - configure cookie session, the value is saved in the db, we just need to hook it up

//routes
app.get("/", function (req, res) {
    res.sendFile(config.path.CLIENT_DIR + "/index.html");
});

httpServer = app.listen(config.port.HTTP, function() {
    console.log("http server listening on port %s", config.port.HTTP);
});

// Web Socket Server
var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({port:config.port.WS}, function(){
    console.log("ws server listening on port %s", config.port.WS);
});

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

// Server sometimes crashes when we try to write to stdout twice at the same time 
// In other words when there are two errors logged at the same time
process.stdout.on('error', function(err){
   console.log('Error when writing to stdout: ' + err); 
});