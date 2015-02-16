// Sends a mouseclick event to the server
// See rogue.h for mouse event definitions

define(['dataIO/socket'], function(ws){
    
    // See PlatformCode/webplaform.c for how these are ultimately used
    
    function send(eventCharCode, xCoord, yCoord, ctrlKey, shiftKey){
         var messageArray = new Uint8ClampedArray(5);
        
        messageArray[0] = eventCharCode;
        messageArray[1] = xCoord;
        messageArray[2] = yCoord;
        messageArray[3] = ctrlKey;
        messageArray[4] = shiftKey;
        
        ws.send(messageArray.buffer);
    }
    
    return send;
    
});