// Routes incoming websocket messages to the appropriate controller

var _ = require('underscore');

function Router(initialControllers){
    this.routeCollection = {};
    this.registerControllers(initialControllers);
}

Router.prototype = {
    registerControllers : function(controllerCollection) {
        for (var cKey in controllerCollection){
            var controller = controllerCollection[cKey];
            this.routeCollection[controller.controllerName] = controller;
        }
    },
    prepareRecievedData : function(rawMessage) {
        return JSON.parse(rawMessage);
    },
    route : function(rawMessage){
                
        if (rawMessage instanceof Buffer){
            this.routeCollection["brogue"].handleIncomingMessage(rawMessage);
            return;
        }
        
        try{
            var message = JSON.parse(rawMessage);
        }
        catch(ex){ 
            this.routeCollection["error"].handleIncomingMessage(rawMessage);
            return;
        }
        
        if (this.routeCollection[message.controller]) {
            this.routeCollection[message.controller].handleIncomingMessage(message);
        }
    }
};

module.exports = Router;