var config = require('../config');
var _ = require('underscore');
var Controller = require('./controller-base');

var allUsers = require('../user/all-users');
var brogueState = require('../enum/brogue-state');

// Controller for broadcasting lobby updates to all users who are currently in the lobby

function LobbyController(ws) {
    this.controllerName = "lobby";
    this.ws = ws;
    this.controllers = null;    
    this.broadcastInterval = null;
    
    // App starts in the lobby - start listening for updates
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
        var self = this;
        this.broadcastInterval = setInterval(function(){
            self.sendAllUserData(false);
        }, config.lobby.UPDATE_INTERVAL);
    },
    stopUserDataListen: function(){
        clearInterval(this.broadcastInterval);
    },
    sendAllUserData: function(includeEveryone){
        
        var self = this;
        var returnLobbyData;

        for (var userName in allUsers.users){
            // Only send data to the lobby of the users who are actually playing a game
            if (allUsers.users[userName].brogueState === brogueState.PLAYING || includeEveryone){              
                if (!returnLobbyData) {
                    returnLobbyData = {};
                }
                
                var userEntry = allUsers.users[userName];
                returnLobbyData[userName] = userEntry.lobbyData;
                
                // update idle time
                var timeDiff = process.hrtime(userEntry.lastUpdateTime)[0];
                returnLobbyData[userName]["idle"] = timeDiff;
            }
        }
        
        // In the event our periodic calling tries to send data to a closed socket
        this.sendMessage("lobby", returnLobbyData, function(err){
            if (!err){
                return;
            }
            
            self.stopUserDataListen();
            self.defaultSendCallback(err);
        });

    }
});

module.exports = LobbyController;
