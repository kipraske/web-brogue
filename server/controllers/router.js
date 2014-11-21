
var _ = require('underscore');

function Router(){
    this.routeCollection = {};
}

Router.prototype = {
    registerController : function(controllerInstance) {
        this.routeCollection[controllerInstance.controllerName] = controllerInstance;
    },
    registerControllers : function(controllerCollection) {
        controllerCollection.forEach(function(controller){
            this.registerController(controller);
        });
    },
    prepareRecievedData : function(rawMessage) {
        // default is to just parse it the message, override to do fancy things
        // TODO - compress data?
        return JSON.parse(rawMessage);
    },
    route : function(message){
        this.routeCollection[message.controller].handleMessage(message);
    }
};

module.exports = Router;