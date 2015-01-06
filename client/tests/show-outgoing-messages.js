define(['dataIO/socket'], function(ws) {

    // Redefine our socket's onmessage event to log all incoming messages in the console.

    var originalSocketSend = ws.send.bind(ws);

    function showOutgoingMessages() {
        
        console.info("You will now see the messages sent to the socket from the client");
        
        ws.send = function(message){
            if (message instanceof ArrayBuffer){
                var messageArray = new Uint8Array(message);
                console.log(messageArray);
            }
            else{
                console.log(message);
            }
            
            originalSocketSend(message);
        };
    }
    
    return showOutgoingMessages;
});