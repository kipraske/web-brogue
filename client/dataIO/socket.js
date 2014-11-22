define(['dataIO/router'], function(router){
    
    // TODO: make this host URL not hardcoded
    
    var socket = new WebSocket("ws://localhost:8080");
    socket.binaryType = "arraybuffer";
    
    socket.onopen = function(){
        console.log("test socket open");
        
        
        // TODO: remove this test and set up cases
        socket.send('{"controller" : "brogue", "type" : "play", "data" : "test message to server"}');
    };
    
    socket.onmessage = function(event){
        console.log("message recieved " + event.data);
    };
   
   return socket;
});


