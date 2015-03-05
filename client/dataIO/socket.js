// Define the web socket object for our application
// All socket messages are immediately passed into the router.

define(['dataIO/router'], function(router){
    
    // websocket is at the same url just using the ws protocol
    var socketUrl = "ws://" + window.location.host + ":8080";
    
    var socket = new WebSocket(socketUrl);
    socket.binaryType = "arraybuffer";
    
    socket.onmessage = function(event){
        router.route(event.data);
    };
   
   return socket;
});


