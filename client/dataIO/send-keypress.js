// TODO - create an arraybuffer to send to the server and hook that into the console
// On the node server we will check the bounds of each element (don't want anything weird on the c side) and then pass it in stdin

// Here will be enums and maps and stuff for minimal processing on the c side


// See BrogueCode/rogue.h for all event definitions

define(['dataIO/socket'], function(ws){
    
    // See PlatformCode/webplaform.c for how these are ultimately used
    
    function send(controlChar, keyCode, ctrlKey, shiftKey){
        
        var messageArray = new Uint8ClampedArray(4);
        
        messageArray[0] = controlChar;
        messageArray[1] = keyCode;
        messageArray[2] = ctrlKey;
        messageArray[3] = shiftKey;
        
        ws.send(messageArray.buffer);
    }
    
    return send;
    
});