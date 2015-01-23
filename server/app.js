var config = require("./config");

var express = require("express");
var app = express();

var mongoose = require("mongoose");
mongoose.connect(config.db.url);

// may want to do something similar for session configuration.  First things first - websocket

// Http Server Configuration
app.use(express.static(config.CLIENT_DIR));

//routes
app.get("/", function(req, res){
    res.sendFile(config.CLIENT_DIR + "/index.html");
});

server = app.listen(80, function(){
    
var port = server.address().port;
    console.log("http server listening on port %s", port);
});

// Web Socket Server
var wsPort = 8080;
var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({port: wsPort}, function(){
    console.log("ws server listening on port %s", wsPort);

});
var ErrorController = require("./controllers/error-controller");
var BrogueController = require("./controllers/brogue-controller");
var AuthController = require("./controllers/authentication-controller");

var Router = require("./controllers/router");

wss.on("connection", function(ws) {

    // Initialize Controllers - each controller needs this specific websocket instance and access to any other controller that it may need to communicate with.
    var clientError = new ErrorController(ws);
    
    var brogue = new BrogueController(ws, {
        error : clientError
    });
    
    var auth = new AuthController(ws, {
        error : clientError, 
        brogue : brogue
    });
    brogue.auth = auth; // added manually due to circular dependency
    
    var router = new Router([
        clientError,
        brogue,
        auth
    ]);
    
    // TODO - make sure that the server is cleaned up when the socket is closed - well or not it depends. on "close"
    
    ws.on("message", function(message){
       router.route(message);
    });
    
});