define(['dataIO/socket'], function(ws) {

    // Redefine the socket send function to log all outgoing messages in the console

    var originalSocketSend = ws.send.bind(ws);

    function showOutgoingMessages() {
        
        console.info("You will now see the messages sent to the socket from the client");
        
        ws.send = function(message){
            originalSocketSend(message);
            if (message instanceof ArrayBuffer){
                var messageArray = new Uint8Array(message);
                console.log(messageArray);
            }
            else{
                console.log(message);
            }
        };
    }
    
    return showOutgoingMessages;
});