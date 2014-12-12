var _ = require('underscore');
var Controller = require('./controller-base');

// Controller for propigating errors back to the client console for debugging purposes

function ErrorController(ws, user) {
    var self = this;
    this.ws = ws;
    this.user = user;
    this.controllerName = "error";
}

ErrorController.prototype = new Controller();
_.extend(ErrorController.prototype, {
    handleIncomingMessage : function(message){
        this.send("Message is not valid JSON: " + message);
    },
    send : function(errorMessage){
        
        // TODO - make a better error logging system
        
        console.log("error: " + errorMessage);
        this.sendMessage("error", errorMessage);
    }
});

module.exports = ErrorController;