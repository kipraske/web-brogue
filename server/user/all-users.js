// module for collecting information to share about each user

var _ = require('underscore');

var sessions = require('client-sessions');

var config = require('../config');
var brogueState = require('../enum/brogue-state');
var brogueStatus = require('../enum/brogue-status-types');

var brogueStatusMap = {};
brogueStatusMap[brogueStatus.DEEPEST_LEVEL] = "deepestLevel";
brogueStatusMap[brogueStatus.GOLD] = "gold";
brogueStatusMap[brogueStatus.SEED] = "seed";
brogueStatusMap[brogueStatus.EASY_MODE] = "easyMode";

var userCount = 0;

module.exports = {
    users : {},
    
    // TODO - should probably split the user object defined here into its own module.  It is strange to be defining what a user is soley in "add user"
    
    addUser : function(userName){
        userCount++;
        this.users[userName] = {
            brogueState : brogueState.INACTIVE,
            lastUpdateTime : process.hrtime(),
            lobbyData : {
                idle : 0,
                deepestLevel : 0,
                seed : 0,
                gold : 0,
                easyMode : false
            }
        };
    },
    removeUser : function(userName){
        delete this.users[userName];
        userCount--;
    },
    getUser : function(userName){
        return this.users[userName];
    },
    updateUser : function(userName, data){
        var oldUserObject = this.getUser(userName);
        this.users[userName] = _.extend(oldUserObject, data);
    },
    isUserValid : function(username) {
        return username in this.users;
    },
    
    updateLobbyStatus : function(userName, updateFlag, updateValue) {

        if (updateFlag === brogueStatus.SEED){
            // just need to report update once per push
            this.users[userName].lastUpdateTime = process.hrtime();
        }
        
        var lobbyItem = brogueStatusMap[updateFlag];
        this.users[userName].lobbyData[lobbyItem] = updateValue;
    },

    createSessionToken: function (username) {
        var sessionOpts = {
            cookieName: 'mySession', // cookie name dictates the key name added to the request object
            secret: config.auth.secret, // should be a large unguessable string
            duration: config.auth.tokenExpiryTime
        };

        var encodedToken = sessions.util.encode(sessionOpts, username, sessionOpts.duration);

        return encodedToken;
    },

    decodeSessionToken: function (token) {
        var sessionOpts = {
            cookieName: 'mySession', // cookie name dictates the key name added to the request object
            secret: config.auth.secret // should be a large unguessable string
        };

        var decodedToken = sessions.util.decode(sessionOpts, token);

        return decodedToken;
    }

};
