var _ = require('underscore');
var config = require('../config');
var childProcess = require('child_process');
var path = require('path');
var fs = require('fs');

var unixdgram = require('unix-dgram');

var router = require('./router');
var Controller = require('./controller-base');
var brogueState = require('../enum/brogue-state');
var allUsers = require('../user/all-users');

var brogueComms = require('../brogue/brogue-comms');

var SERVER_SOCKET = 'server-socket';
var CLIENT_SOCKET = 'client-socket';

var CELL_MESSAGE_SIZE = 10;

var STATUS_MESSAGE_NUMBER = 4;
var STATUS_MESSAGE_SIZE = STATUS_MESSAGE_NUMBER * CELL_MESSAGE_SIZE;
var STATUS_BYTE_FLAG = 255;
var STATUS_DATA_OFFSET = 2;

var MOUSE_INPUT_SIZE = 5;
var KEY_INPUT_SIZE = 5;

// Controller for handling I/O with brogue process and client.  Note that unlike other controllers this one deals in binary data. Any incoming or outgoing binary data from this server should only come from this controller.

function BrogueController(ws) {
    this.controllerName = "brogue";
    this.ws = ws;
    this.controllers = null;
    
    this.currentState = brogueState.INACTIVE;
    this.brogueChild;  // child process
    this.dataAccumulator; // buffer
    this.brogueInterface;
    this.dataRemainder = new Buffer(0);
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

        this.brogueInterface.handleIncomingBinaryMessage(message, function(err) {

            if(err) {
                this.controllers.error.send(err.message);
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

    handlerCollection: {
        start: function (data) {

            //TODO: assuming data has the username of the session to get

            var brogueSessionName;

            if(!data.username) {
                brogueSessionName = this.controllers.auth.currentUserName;
            }
            else {
                brogueSessionName = data.username;
            }

            //(could do this in callback style, since it's kinda IO
            this.brogueInterface = brogueComms.getBrogueInterface(brogueSessionName);
            this.controllers.lobby.stopUserDataListen();
            this.setState(brogueState.PLAYING);

            //TODO: Handle errors


        },
        
        clean: function (data) {
            
            // TODO - this function is for gracefully exiting brogue, right now we will just kill it            
            //Commented out temporarily so we can practice reconnecting - seems to be called on logout (window close)
            //this.handlerCollection.kill.call(this, data);
        },
        
        kill: function (data) {
            if (! this.brogueChild){
                return;
            }
            this.brogueChild.kill('SIGINT');
            this.brogueChild = null;
        },
    },
    
    setState : function(state){
        this.currentState = state;
        allUsers.users[this.controllers.auth.currentUserName].brogueState = state;
    },

});

module.exports = BrogueController;