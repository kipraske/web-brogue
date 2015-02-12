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

httpServer = app.listen(80, function(){
    
var port = httpServer.address().port;
    console.log("Server listening on port %s", port);
});

// Web Socket Server
var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({server: httpServer});

var ErrorController = require("./controllers/error-controller");
var BrogueController = require("./controllers/brogue-controller");
var AuthController = require("./controllers/authentication-controller");
var LobbyController = require("./controllers/lobby-controller");

var controllerFactory = require("./controllers/controller-factory")
var cleanUp = require("./controllers/cleanup-controllers.js");
var Router = require("./controllers/router");

wss.on("connection", function(ws) {

    var controllers = controllerFactory(ws, [
        "error",
        "lobby",
        "authentication",
        "brogue"
    ]);
    
    console.log(controllers);
    
    // Initialize Controllers - each controller needs this specific websocket instance and access to any other controller that it may need to communicate with.
    var clientError = new ErrorController(ws);
    
    var lobby = new LobbyController(ws, {
        error : clientError
    });
    
    var brogue = new BrogueController(ws, {
        error : clientError,
        lobby : lobby
    });
    
    var auth = new AuthController(ws, {
        error : clientError, 
        brogue : brogue
    });
    brogue.auth = auth; //circular dependency
 
    // TODO - can probably remove the circular dependency here by creating a "current User" object which holds the current user info
    // That would make a lot of things cleaner in the code, but this is not as high priority as other issues at the moment
 
    var router = new Router([
        clientError,
        brogue,
        auth,
        lobby
    ]);
    
    ws.on("message", function(message){
       router.route(message);
    });
    
    ws.on("close", function(code, message){
        cleanUp({
            auth : auth,
            brogue : brogue,
            lobby : lobby
        })
    })
    
});