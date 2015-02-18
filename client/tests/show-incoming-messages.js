// Redefine our socket's onmessage event to log all incoming messages in the console.

define(['dataIO/socket', 'dataIO/router'], function(ws, router) {

    function showIncomingMessages() {
        
        console.info("You will now see messages recieved by the socket from the server")
        
        var originalOnmessage = ws.onmessage.bind(ws);
        
        ws.onmessage = function(event){
            originalOnmessage(event);
            
            var message = event.data;
            
            if (message instanceof ArrayBuffer){
                var messageArray = new Uint8Array(message);
                console.log(messageArray);
            }
            else{
                console.log(message);
            }
    };
    }
    
    return showIncomingMessages;
});


