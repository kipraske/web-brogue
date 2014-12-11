define(['dataIO/socket'], function(ws){
    
    // See PlatformCode/webplaform.c for how these are ultimately used
    
    function send(controlChar, xCoord, yCoord, ctrlKey, shiftKey){
        console.log("mouse-clicked");
    }
    
    return send;
    
});