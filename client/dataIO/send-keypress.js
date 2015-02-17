// Sends keystroke to the server
// Note that the keyCode is a 16 bit character which will need to be split for transmission

define(['dataIO/socket'], function(ws){
    
    // See PlatformCode/webplaform.c for how these are ultimately used
    
    function send(eventCharCode, keyCode, ctrlKey, shiftKey){
        
        var messageArray = new Uint8ClampedArray(5);
        
        var keyCodePart1 = (keyCode & '0xffff') >> 8;
        var keyCodePart2 = (keyCode & '0xff');
        
        messageArray[0] = eventCharCode;
        messageArray[1] = keyCodePart1;
        messageArray[2] = keyCodePart2;
        messageArray[3] = ctrlKey;
        messageArray[4] = shiftKey;
        
        ws.send(messageArray.buffer);
    }
    
    return send;
    
});