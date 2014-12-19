var _ = require('underscore');
var util = require('util');
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
    
    send : function(message){
        
        // TODO - make a better error logging system - say in a file rather than out to the console
        var errorMessage = "Server Error: " + message;
        
        util.log(errorMessage);
        this.sendMessage("error", errorMessage);
    }
});

module.exports = ErrorController;