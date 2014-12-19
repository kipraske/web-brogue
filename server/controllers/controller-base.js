function Controller() {
    this.ws = null;
    this.user = null;
    this.error = null;
    this.controllerName = "";
    
    this.handlerCollection = {};  // collection of handlername : function
    
    this.handleIncomingMessage = function (message) {
        if (this.handlerCollection[message.type]) {
            this.handlerCollection[message.type].call(this, message.data);
        }
        else {
            this.error.send("Message type incorrectly set: " + JSON.stringify(message));
        }
    };
    
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