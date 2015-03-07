// Main entry point in server side code.  Sets up http server and websocket server and routes

var config = require("./config");
var util = require("util");

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

var httpServer = app.listen(config.port.HTTP, function() {
    console.log("http server listening on port %s", config.port.HTTP);
});

httpServer.on("clientError", function(err, socket){
    util.log("Error from client socket in http server: " + err);
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
    
    ws.on("error", function(err){
        util.log('Error emitted internally from web socket instance: ' + err); 
    });
});

wss.on("error", function(err){
   util.log('Error emitted internally from web socket server: ' + err); 
});

// Process Handlers
process.stdout.on('error', function(err){
   util.log('Error when writing to process stdout: ' + err); 
});