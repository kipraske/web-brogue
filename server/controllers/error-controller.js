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
    send : function(errorMessage){
        this.sendMessage("error", errorMessage);
    }
});

module.exports = ErrorController;