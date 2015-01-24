define(['dataIO/socket'], function(ws){
    
    var RNG_CHECK_CHAR = 6
    
    // Requests a status update for the lobby from the brogue process.  
    
    function send(){
        
        var messageArray = new Uint8ClampedArray(1);
        
        messageArray[0] = RNG_CHECK_CHAR;
        
        ws.send(messageArray.buffer);
    }
    
    return send;
    
});


