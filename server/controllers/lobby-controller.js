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
    // The lobby would not normally get user requests, but I am adding this so we can test these functions
    handlerCollection : {
        requestSingleUserData : function(username){
            console.log(allUsers.users[username].lobbyData);
        },
        requestAllUserData : function(overrideState){
            if (!overrideState){
                overrideState = true;
            }
            this.sendAllUserData(overrideState);
        }
    },
    
    broadcastListen : function(){
        this.broadcastInterval = setInterval(this.sendAllUserData, UPDATE_INTERVAL_TIME);
    },
    stopbroadcastListen: function(){
        clearInterval(this.broadcastInterval);
    },
    sendAllUserData: function(overrideState){

        for (userName in allUsers.users){
            // Normally we would only want to get this data if we were not playing, but I am putting in an override so we can request this data whenever we want if needed
            if (allUsers.users[userName].brogueState === brogueState.INACTIVE || overrideState){
                
                // TODO - the logic here
                console.log(userName + ":");
                console.log(allUsers.users[userName].lobbyData);    
            }
        }
        
        // TODO - parse all users and send an update object to the lobby - if there is a time I need to figure out how to gzip this is it.
        
    }
});

module.exports = LobbyController;
