define(['dataIO/router'], function(router){
    
    // TODO: make this host URL not hardcoded
    
    var socket = new WebSocket("ws://localhost:8080");
    
    socket.onopen = function(){
        console.log("test socket open");
        
        socket.send("test message to server");
    };
    
    socket.onmessage = function(event){
        console.log("message recieved " + event.data);
    };
   
   return socket;
});


