define(['dataIO/router'], function(router){
    
    // TODO: make this host URL not hardcoded
    
    var socket = new WebSocket("ws://localhost:8080");
    socket.binaryType = "arraybuffer";
    
    // TODO : set up onerror, onclose all that stuff
    
    socket.onopen = function(){
        console.log("test socket open");
        // TODO - probably need to do more than this
    };
    
    socket.onmessage = function(event){
        var message = router.prepareIncomingData(event.data);
        router.route(message);
    };
   
   return socket;
});


