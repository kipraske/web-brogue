var config = require("./config");
var setupAuthentication = require("./user/setup-auth");
var authenticateUser = require("./user/authenticate");

var express = require("express");
var app = express();


var mongoose = require("mongoose");
mongoose.connect(config.db.url);

// TODO: set up the authentication parts in a different file
// something like require(./auth)(app, passport);

setupAuthentication(app);

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

    var currentUser = {};

    var router = new Router();
    var clientError = new ErrorController(ws, currentUser);
    var brogue = new BrogueController(ws, currentUser, clientError);
    var auth = new AuthController(ws, currentUser, brogue);
    router.registerControllers([
        clientError,
        brogue,
        auth
    ]);
    
    ws.on("message", function(message){
       router.route(message);
    });
    
});