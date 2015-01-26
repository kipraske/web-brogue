var _ = require('underscore');
var util = require('util');
var Controller = require('./controller-base');

// Controller for propigating errors back to the client console for debugging purposes

function ErrorController(ws, currentUser) {
    this.ws = ws;
    this.currentUser = currentUser;
}

ErrorController.prototype = new Controller();
_.extend(ErrorController.prototype, {
    controllerName : "error",
    
    handleIncomingMessage : function(message){
        this.send("Message is not valid JSON: " + message);
    },
    
    log : function(message){
        util.log(message);
    },
    
    send : function(message){
        var errorMessage = "Server Error: " + message;
        this.log(errorMessage);
        this.sendMessage("error", errorMessage);
    }
});

module.exports = ErrorController;