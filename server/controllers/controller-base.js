function Controller() {
    this.controllerName = "";
    this.ws;
    this.controllers;
    
    this.defaultSendCallback = function(err){
        if (!err){
            return;
        }
        
        this.error.log("Server Error: There is a problem with the socket that prevented sending: " + err);
    };
    
    this.handlerCollection = {};  // collection of handlername : function
    
    this.handleIncomingMessage = function (message) {
        if (this.handlerCollection[message.type]) {
            this.handlerCollection[message.type].call(this, message.data);
        }
        else {
            this.error.send("Message type incorrectly set: " + JSON.stringify(message));
        }
    };
    
    this.sendMessage = function(messageType, messageData, callback){
        
        if (!callback){
            callback = this.defaultSendCallback;
        }
        
        var messageObject = {
            "type" : messageType,
            "data" : messageData
        };

        var message = JSON.stringify(messageObject);
        
        this.ws.send(message, callback);
    };
}

module.exports = Controller;