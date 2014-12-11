
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
    route : function(rawMessage){
        
        if (rawMessage instanceof ArrayBuffer && this.routeCollection["brogue"]){
            this.routeCollection["brogue"].handleIncomingMessage(rawMessage);
        }
        
        try{
            var message = JSON.parse(rawMessage);
        }
        catch(ex){
            
            // TODO : this will not work since this error has no access to the ws instance which sent the message
            // need to do this.routeCollection["error"].handleIncomingMessage(rawMessage) and define that in errors
            
            error.send("Invalid message recieved: " + rawMessage);
            return;
        }
        
        if (this.routeCollection[message.controller]) {
            this.routeCollection[message.controller].handleIncomingMessage(message);
        }
    }
};

module.exports = Router;