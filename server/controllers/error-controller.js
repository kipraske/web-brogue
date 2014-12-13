var _ = require('underscore');
var Controller = require('./controller-base');

// Controller for propigating errors back to the client console for debugging purposes

function ErrorController(ws, user) {
    this.ws = ws;
    this.user = user;
}

ErrorController.prototype = new Controller();
_.extend(ErrorController.prototype, {
    controllerName : "error",
    
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