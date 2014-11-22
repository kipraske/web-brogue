
var _ = require('underscore');

function Router(){
    this.routeCollection = {};
}

Router.prototype = {
    registerControllers : function(controllerCollection) {
        var self = this;
        controllerCollection.forEach(function(controller){
            self.routeCollection[controller.controllerName] = controller;
        });
    },
    prepareRecievedData : function(rawMessage) {
        // default is to just parse it the message, override to do fancy things
        // TODO - compress data?
        return JSON.parse(rawMessage);
    },
    route : function(message){
        if (this.routeCollection[message.controller]) {
            this.routeCollection[message.controller].handleIncomingMessage(message);
        }
    }
};

module.exports = Router;