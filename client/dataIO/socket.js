// Define the web socket object for our application
// All socket messages are immediately passed into the router.

define(['dataIO/router'], function(router){
    
    // websocket is at the same url just using the ws protocol
    var hostname = process.env.SERVER_HOSTNAME || window.location.host
    var socketUrl = "ws://" + hostname + ":8080";
    
    if (!window.WebSocket){
        alert("Your browser does not seem to support websockets which are needed for this application");
    }
    
    var socket = new WebSocket(socketUrl);
    socket.binaryType = "arraybuffer";
    
    socket.onclose = function(event){
        alert("Your socket has unexpectedly closed. Refresh the page to reconnect.");
    };
    
    socket.onmessage = function(event){
        router.route(event.data);
    };
   
   return socket;
});


