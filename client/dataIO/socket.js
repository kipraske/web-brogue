// Define the web socket object for our application
// All socket messages are immediately passed into the router.

define(['dataIO/router', 'dispatcher', 'io'], function(router, dispatcher, io){

    var socket = io.connect(window.location.hostname + ":8080");

    socket.on('message', function(event) {
        router.route(event);
    });

    socket.on('connect', function() {
    });

    socket.on('reconnect', function() {
        dispatcher.trigger("reconnect");
    });
   
   return socket;
});


