function Controller(){
    this.controllerName;
    this.handleIncomingMessage = function(){};
    
    this.sendMessage = function(messageType, messageData){
        var messageObject = {
            "type" : messageType,
            "data" : messageData
        };

        var message = JSON.stringify(messageObject);
        
        this.ws.send(message);
    };
}

module.exports = Controller;