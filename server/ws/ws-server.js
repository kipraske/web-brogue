
var router = require("./router");

var wsPort = 8080;

var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({port: wsPort});

wss.on("connection", function(ws) {
   
    console.log("ws server listening on port %s", wsPort);
    
    ws.on("message", function(msg){
       
       // TODO route incoming message
       
       console.log("recieved %s", msg);
    });
   
   
   //register outgoing messages
   
   
});
