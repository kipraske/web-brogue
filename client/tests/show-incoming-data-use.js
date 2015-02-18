// Test how much data is coming through the socket.  Needed for estimating how much hosting data will be needed.

define(['dataIO/socket', 'dataIO/router'], function(ws, router) {

    function showIncomingDataUse() {
        
        console.info("You will now see a running total of the data that is coming through the websocket");
        
        var originalOnmessage = ws.onmessage.bind(ws);
        var totalLength = 0;
        
        ws.onmessage = function(event){
            originalOnmessage(event);
            
            var message = event.data;
            var incomingLength = 0;
            
            if (message instanceof ArrayBuffer){
                var messageArray = new Uint8Array(message);
                incomingLength = messageArray.length;
            }
            else if (message.length){
                // strings use utf-16 by default
                incomingLength = message.length * 2;
            }
            
            totalLength += incomingLength;
            console.log("Incoming message was " + incomingLength + " bytes");
            console.log("Total socket bytes: " + totalLength);
    };
    }
    
    return showIncomingDataUse;
});




