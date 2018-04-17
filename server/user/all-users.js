// module for collecting information to share about each user

var _ = require('underscore');

var config = require('../config');
var brogueState = require('../enum/brogue-state');
var brogueStatus = require('../enum/brogue-status-types');

var brogueStatusMap = {};
brogueStatusMap[brogueStatus.DEEPEST_LEVEL] = "deepestLevel";
brogueStatusMap[brogueStatus.GOLD] = "gold";
brogueStatusMap[brogueStatus.SEED] = "seed";
brogueStatusMap[brogueStatus.EASY_MODE] = "easyMode";

var IDLE_TICKER_INTERVAL_MS = 1 * 1000;
var IDLE_TIME_MAXIMUM_SECONDS = 48 * 60 * 60;

module.exports = {
    users : {},
    
    // TODO - should probably split the user object defined here into its own module.  It is strange to be defining what a user is soley in "add user"
    
    addUser : function(userName){

        this.users[userName] = {
            brogueState : brogueState.INACTIVE,
            lastUpdateTime : process.hrtime(),
            lobbyData : {
                idle : 0,
                deepestLevel : 0,
                seed : 0,
                gold : 0,
                easyMode : false,
                variant : ''
            }
        };
    },
    removeUser : function(userName){
        if(this.isUserValid(userName)) {
            delete this.users[userName];
        }
    },
    getUser : function(userName){
        if(this.isUserValid(userName)) {
            return this.users[userName];
        }
    },
    setState: function(userName, state) {
        if(this.isUserValid(userName)) {
            this.users[userName].brogueState = state;
        }
    },
    tickIdleUsers: function() {

        var usersToRemoveDueToLongIdle = [];

        for (var userName in this.users) {
            var timeDiff = process.hrtime(this.users[userName].lastUpdateTime)[0];
            this.users[userName].lobbyData.idle = timeDiff;

            if(timeDiff > IDLE_TIME_MAXIMUM_SECONDS) {
                usersToRemoveDueToLongIdle.push(userName);
            }
        }

        for (var i = 0; i < usersToRemoveDueToLongIdle.length; i++) {
            this.removeUser(usersToRemoveDueToLongIdle[i]);
        }
    },

    isUserValid : function(username) {
        return username in this.users;
    },
    initialiseLobbyStatus : function(userName, variant) {
        this.users[userName].lobbyData['variant'] = variant;
    },

    updateLobbyStatus : function(userName, updateFlag, updateValue) {

        if (updateFlag === brogueStatus.SEED) {
            // just need to report update once per push
            this.users[userName].lastUpdateTime = process.hrtime();
        }
        
        var lobbyItem = brogueStatusMap[updateFlag];
        this.users[userName].lobbyData[lobbyItem] = updateValue;
    },

    startIdleTicker: function () {
        setInterval(this.tickIdleUsers.bind(this), IDLE_TICKER_INTERVAL_MS);
    }
};

module.exports.startIdleTicker();