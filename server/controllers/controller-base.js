
function Controller(){
    this.controllerName;
    this.handleIncomingMessage = function(){};
    
    this.prepareDataForSending = function(messageType, messageData){
        var messageObject = {
            "controller" : this.controllerName,
            "type" : messageType,
            "data" : messageData
        };

        return JSON.stringify(messageObject);
    };
}

module.exports = Controller;