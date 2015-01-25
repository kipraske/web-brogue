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
    
    // App starts in the lobby - start listening for updates
    this.sendAllUserData();
    this.userDataListen();
}

LobbyController.prototype = new Controller();
_.extend(LobbyController.prototype, {
    controllerName: "lobby",
    // The lobby would not normally get user requests, but I am adding this so we can test these functions
    handlerCollection : {
        requestSingleUserData : function(username){
            console.log(allUsers.users[username].lobbyData);
        },
        requestAllUserData : function(includeEveryone){
            this.sendAllUserData(includeEveryone);
        }
    },
    
    userDataListen : function(){
        this.broadcastInterval = setInterval(this.sendAllUserData, UPDATE_INTERVAL_TIME);
    },
    stopuserDataListen: function(){
        clearInterval(this.broadcastInterval);
    },
    sendAllUserData: function(includeEveryone){

        var returnLobbyData;

        for (var userName in allUsers.users){
            // Only send data to the lobby of the users who are actually playing a game
            if (allUsers.users[userName].brogueState === brogueState.PLAYING || includeEveryone){              
                if (!returnLobbyData) {
                    returnLobbyData = {};
                }
                returnLobbyData[userName] = allUsers.users[userName].lobbyData;  
            }
        }
        
        // TODO - only send to user if they are currently in the inactive state - will need to get the brogue controller in here afterall
        
        if (returnLobbyData){
            this.sendMessage("lobby", returnLobbyData);
        }        
    }
});

module.exports = LobbyController;
