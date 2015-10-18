// Define the web socket object for our application
// All socket messages are immediately passed into the router.

define(['dataIO/router', 'io'], function(router, io){
    
    // websocket is at the same url just using the ws protocol
    /*
    var socketUrl = "ws://" + window.location.hostname + ":8080";
    
    if (!window.WebSocket){
        alert("Your browser does not seem to support websockets which are needed for this application");
    }
    */

    /*
    var socket = new WebSocket(socketUrl);
    socket.binaryType = "arraybuffer";
    
    socket.onclose = function(event){

        //Remove for development
        //alert("Your socket has unexpectedly closed. Refresh the page to reconnect.");
    };*/

    var socket = io.connect(window.location.hostname + ":8081");

    socket.on('msg', function(event) {
        console.log('full event');
        console.log(JSON.stringify(event));
        router.route(event);
    });
   
   return socket;
});


