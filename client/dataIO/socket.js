// Define the web socket object for our application
// All socket messages are immediately passed into the router.

define(['dataIO/router', 'dispatcher', 'io', 'config'], function(router, dispatcher, io, config){

    var socket = io.connect(window.location.hostname + ":" + config.websocketPort);

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


