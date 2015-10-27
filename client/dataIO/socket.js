// Define the web socket object for our application
// All socket messages are immediately passed into the router.

define(['dataIO/router', 'io'], function(router, io){

    var socket = io.connect(window.location.hostname + ":8080");

    socket.on('message', function(event) {
        router.route(event);
    });
   
   return socket;
});


