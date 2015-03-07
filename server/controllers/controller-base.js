// A controller in the context of this application is just a part of the code which can recieve messages and send messages.  The controller base defines this basic functionality.

function Controller() {
    this.controllerName = "";
    this.ws;
    this.controllers;
    
    this.defaultSendCallback = function(err){
        if (!err){
            return;
        }
        // Going to just eat this error.  If you navigate away from the page at the right time it fires quite a few times.
        // this.controllers.error.log("Server Error: There is a problem with the socket that prevented sending: " + err);
    };
    
    this.handlerCollection = {};  // collection of handlername : function
    
    this.handleIncomingMessage = function (message) {
        if (this.handlerCollection[message.type]) {
            this.handlerCollection[message.type].call(this, message.data);
        }
        else {
            this.controllers.error.send("Message type incorrectly set: " + JSON.stringify(message));
        }
    };
    
    this.sendMessage = function(messageType, messageData, callback){
        
        if (!callback){
            callback = this.defaultSendCallback.bind(this);
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