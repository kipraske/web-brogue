var path = require('path');
var fs = require('fs');
var _ = require('underscore');

var router = require('./router');
var config = require('../config');

var Controller = require('./controller-base');
var brogueState = require('../enum/brogue-state');
var allUsers = require('../user/all-users');
var brogueComms = require('../brogue/brogue-comms');
var gameRecord = require('../database/game-record-model')
var brogueConstants = require('../brogue/brogue-constants.js');

// Controller for handling I/O with brogue process and client.  Note that unlike other controllers this one deals in binary data. Any incoming or outgoing binary data from this server should only come from this controller.

//TODO: Cleanup brogueInterface on controller exit

function BrogueController(ws) {
    this.controllerName = "brogue";
    this.ws = ws;
    this.controllers = null;
    this.readOnly = true;
}

BrogueController.prototype = new Controller();
_.extend(BrogueController.prototype, {
    controllerName: "brogue",
    handleIncomingMessage: function (message) {
        if (message instanceof Buffer) {
            this.handleIncomingBinaryMessage(message);
        }
        else
        {
            this.handleIncomingJSONMessage(message);
        }
    },

    handleIncomingBinaryMessage : function(message){

        if(!this.brogueInterface) {
            this.controllers.error.send("Not connected to brogue session");
            return;
        }

        if(this.readOnly) {
            return;
        }

        var self = this;

        this.brogueInterface.handleIncomingBinaryMessage(message, function(err) {

            if(err) {
                self.controllers.error.send(err.message);
            }
        });
    },
    
    handleIncomingJSONMessage: function (message) {
        if (this.handlerCollection[message.type]) {
            this.handlerCollection[message.type].call(this, message.data);
        }
        else {
            this.controllers.error.send("Message type incorrectly set: " + JSON.stringify(message));
        }
    },

    endBrogueSession: function() {
        this.sendMessage("quit", true);
        this.setState(brogueState.INACTIVE);
        this.controllers.lobby.sendAllUserData();
        this.controllers.lobby.userDataListen();

        this.removeBrogueListeners();
    },

    removeBrogueListeners: function() {

        //Is called on cleanup when WS connection dies, but may have already dropped listeners
        if(this.brogueInterface) {
            //console.log("Removing data listener. Before " + this.brogueInterface.brogueEvents.listeners('data').length);

            this.brogueInterface.removeDataListener(this.dataListener);
            //console.log("Removing data listener. After " + this.brogueInterface.brogueEvents.listeners('data').length);

            this.brogueInterface.removeStatusListener(this.statusListener);
            this.brogueInterface.removeQuitListener(this.quitListener);
            this.brogueInterface.removeErrorListener(this.errorListener);
            this.brogueInterface.removeEventListener(this.eventListener);
        }
    },

    brogueQuitListener: function () {
        //console.log("Quit listener " + this.username);
        this.endBrogueSession();
    },

    brogueErrorListener: function () {
        //console.log("Error listener" + this.username);
        //TODO: Maybe some UI for the user? This normally occurs on an orphaned process connecting, which is expected behaviour
        this.endBrogueSession();
    },

    brogueEventListener: function (event) {
        //console.log("Event listener " + this.username + " data: " + JSON.stringify(event));

        //Add record to the database (only if owner of game)
        //TODO: Maybe just one eventId for end game events?
        if(!this.readOnly && (
            event.eventId === brogueConstants.GAMEOVER_QUIT ||
            event.eventId === brogueConstants.GAMEOVER_DEATH ||
            event.eventId === brogueConstants.GAMEOVER_VICTORY ||
            event.eventId === brogueConstants.GAMEOVER_SUPERVICTORY)) {

            var self = this;
            var thisGameRecord = {
                username: this.controllers.auth.currentUserName,
                score: event.data1,
                seed: event.seed,
                level: event.level,
                result: event.eventId,
                easyMode: Boolean(event.easyMode),
                description: event.message
            };

            gameRecord.create(thisGameRecord, function (err) {
                if (err) {
                    self.controllers.error.send(JSON.stringify(err));
                    return;
                }
            });
        }
    },

    brogueStatusListener: function (status) {
        if(!this.readOnly) {
            if(!allUsers.isUserValid(this.controllers.auth.currentUserName)) {
                //This is a funny exception to deal with the case when the user has logged out from one window
                //but is still playing
                allUsers.addUser(this.controllers.auth.currentUserName);
            }

            //We may have a different state due to logging in again in a different window, but PLAYING should take priority
            this.setState(brogueState.PLAYING);
            allUsers.updateLobbyStatus(
                this.controllers.auth.currentUserName,
                status.flag,
                status.value);
        }
    },

    brogueDataListener: function (data) {
        this.ws.send(data, {binary: true}, this.defaultSendCallback.bind(this));
    },

    handlerCollection: {
        start: function (data) {

            var brogueSessionName;

            //Work out if this is the user playing their own game or just observing
            if(!data || !data.username) {
                brogueSessionName = this.controllers.auth.currentUserName;
                this.readOnly = false;
            }
            else {
                if(this.controllers.auth.currentUserName) {
                    if(data.username === this.controllers.auth.currentUserName) {
                        this.readOnly = false;
                    }
                }
                brogueSessionName = data.username;
            }

            this.username = brogueSessionName; //for debugging

            //Check input parameters and abort on error
            if(data && data.seed) {
                var seed = parseInt(data.seed, 10);

                if (isNaN(seed) || seed < 1 || seed > 4294967295) {
                    this.sendMessage("seed", {
                                              result : "fail",
                                              data : "Please enter a numerical seed between 1 and 4294967295"
                    });
                    return;
                }
            }

            //This feels like the job of brogueInterface, however on initialisation brogueInterface can't
            //send errors to the UI
            if(data && data.savedGame) {
                var childWorkingDir = config.path.GAME_DATA_DIR + this.username;
                var savedGamePath = path.normalize(childWorkingDir + "/" + data.savedGame);
                try {
                    fs.accessSync(savedGamePath, fs.F_OK);
                }
                catch (err) {
                    this.controllers.error.send("Saved Game Not Found: '" + data.savedGame + "' does not exist");
                    return;
                }
            }

            //Connect to brogue interface

            this.brogueInterface = brogueComms.getBrogueInterface(brogueSessionName, data);

            //console.log("Adding listeners. Count " + this.brogueInterface.brogueEvents.listeners('data').length);

            this.dataListener = this.brogueDataListener.bind(this);
            this.brogueInterface.addDataListener(this.dataListener);

            this.quitListener = this.brogueQuitListener.bind(this);
            this.brogueInterface.addQuitListener(this.quitListener);

            this.errorListener = this.brogueErrorListener.bind(this);
            this.brogueInterface.addErrorListener(this.errorListener);

            this.eventListener = this.brogueEventListener.bind(this);
            this.brogueInterface.addEventListener(this.eventListener);

            this.statusListener = this.brogueStatusListener.bind(this);
            this.brogueInterface.addStatusListener(this.statusListener);

            //console.log("Added listeners. Count " + this.brogueInterface.brogueEvents.listeners('data').length);

            this.controllers.lobby.stopUserDataListen();

            //Refresh once the game has had a chance to start (if required)
            var refreshMethod = this.brogueInterface.sendRefreshScreen.bind(this.brogueInterface);
            setTimeout(refreshMethod, 250);

            if (this.readOnly) {
                this.setState(brogueState.WATCHING);
            }
            else {
                this.setState(brogueState.PLAYING);
            }

            //If we got here via a seed or save game route, pass messages back to the UI
            if(data && data.seed) {
                this.sendMessage("seed", {
                    result: "success"
                });
            }
        },
        
        clean: function (data) {
            
            // Called on logout or websocket close
            this.handlerCollection.kill.call(this, data);
            //Commented out temporarily so we can practice reconnecting - seems to be called on logout (window close)
            //this.handlerCollection.kill.call(this, data);
        },

        //TODO: If required, this needs to migrate to interface
        kill: function (data) {

            //Just kill off the controller gracefully, leave the process (both observing and playing)
            this.removeBrogueListeners();
        },
    },
    
    setState : function(state){

        if(allUsers.isUserValid(this.controllers.auth.currentUserName)) {
            allUsers.users[this.controllers.auth.currentUserName].brogueState = state;
        }
    },

});

module.exports = BrogueController;