define(['dataIO/socket'], function(ws) {
    
    function sendSocketMessage(controller, type, data){
        
        var message = {
            controller : controller,
            type : type,
            data : data
        };
        
        var socketMessage = JSON.stringify(message);
        ws.send(socketMessage);
    }
    
    return sendSocketMessage;

});

