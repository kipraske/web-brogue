var config = require('../config');
var _ = require('underscore');
var Controller = require('./controller-base');

var allUsers = require('../user/all-users');
var brogueState = require('../enum/brogue-state');

var UPDATE_INTERVAL_TIME = 10000;

// Controller for broadcasting lobby updates to all users who are currently in the lobby

function LobbyController(ws, sharedControllers) {
    this.ws = ws;
    this.error = sharedControllers.error;
    this.brogue = sharedControllers.brogue;
    
    this.broadcastInterval = null;
}

LobbyController.prototype = new Controller();
_.extend(LobbyController.prototype, {
    controllerName: "lobby",
    startUpdates : function(){
        this.broadcastInterval = setInterval(this.sendData, UPDATE_INTERVAL_TIME);
    },
    stopUpdates: function(){
        clearInterval(this.broadcastInterval);
    },
    sendData: function(){
        
        for (user in allUsers.users){
            if (user.brogueState === brogueState.INACTIVE){
                
                // TODO - the logic here
                console.log(user.sessionID);    
            }
        }
        
        // TODO - parse all users and send an update object to the lobby - if there is a time I need to figure out how to gzip this is it.
        
    }
});

module.exports = LobbyController;
