define(['dataIO/router'], function(router){
    
    // websocket is at the same url just using the ws protocol
    var socketUrl = "ws://" + window.location.host;
    
    var socket = new WebSocket(socketUrl);
    socket.binaryType = "arraybuffer";
    
    // TODO : set up onerror, onclose all that stuff
    
    socket.onopen = function(){
        console.log("Web Socket Connection Open");
    };
    
    socket.onmessage = function(event){
        router.route(event.data);
    };
   
   return socket;
});


