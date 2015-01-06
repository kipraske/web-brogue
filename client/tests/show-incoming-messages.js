define(['dataIO/socket', 'dataIO/router'], function(ws, router) {

    // Redefine our socket's onmessage event to log all incoming messages in the console.

    function showIncomingMessages() {
        
        console.info("You will now see messages recieved by the socket from the server")
        
        ws.onmessage = function(event){
            
            var message = event.data;
            
            if (message instanceof ArrayBuffer){
                var messageArray = new Uint8Array(message);
                console.log(messageArray);
            }
            else{
                console.log(message);
            }
        router.route(message);
    };
    }
    
    return showIncomingMessages;
});


