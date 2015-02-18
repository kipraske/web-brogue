// Update a single console cell information

define(['dataIO/router'], function(router) {
    
    var CELL_MESSAGE_SIZE = 9;
    
    function updateSingleConsoleCell( x, y, char, fRed, fGreen, fBlue, bRed, bGreen, bBlue){
        
        if (arguments.length !== 9) return;
        
        var messageBuf = new ArrayBuffer(CELL_MESSAGE_SIZE);
        var messageArray = new Uint8ClampedArray(messageBuf);
        
        for (var i = 0; i < CELL_MESSAGE_SIZE; i++){
            messageArray[i] = arguments[i];
        }
        
        router.route(messageBuf);
    }

return updateSingleConsoleCell;

});


