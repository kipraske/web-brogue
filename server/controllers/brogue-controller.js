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
        
        var controlValue = message.readUInt8(0);
        var messageLength = message.length;
        var ctrlCheck;
        var shiftCheck;
        var isValid;
        
        if (controlValue === 0) { // key input
            ctrlCheck = message.readUInt8(3);
            shiftCheck = message.readUInt8(4);
            isValid = (messageLength === KEY_INPUT_SIZE) &&
                    (ctrlCheck === 0 || ctrlCheck === 1) &&
                    (shiftCheck === 0 || shiftCheck === 1);    
        }
        else if (controlValue >= 1 && controlValue <= 5){ // mouse input
            ctrlCheck = message.readUInt8(3);
            shiftCheck = message.readUInt8(4);
            isValid = (messageLength === MOUSE_INPUT_SIZE) &&
                    (ctrlCheck === 0 || ctrlCheck === 1) &&
                    (shiftCheck === 0 || shiftCheck === 1);
        }
        
        if (!isValid){
            this.controllers.error.send("Invalid mouse or key input: " + JSON.stringify(message));
            return;
        }

        //Send message to socket, if connected
        if (this.brogueSocket) {
            this.brogueSocket.send(message, 0, messageLength, this.getChildWorkingDir() + "/" + SERVER_SOCKET, function() {
                    //console.error('client send');
            });
        }
    },
    
    handleIncomingJSONMessage: function (message) {
        if (this.handlerCollection[message.type]) {
            this.handlerCollection[message.type].call(this, message.data);
        }
        else {
            this.controllers.error.send("Message type incorrectly set: " + JSON.stringify(message));
        }
    },

    getChildWorkingDir: function () {
      return config.path.GAME_DATA_DIR + this.controllers.auth.currentUserName;
    },

    handlerCollection: {
        start: function (data) {
            var currentUserName = this.controllers.auth.currentUserName;

            if (!currentUserName || this.brogueChild) {
                return;
            }

            //This test is removed, since there we don't spawn more than 1 process, we reconnect

            // A single user is only allowed to have one brogue process
            //if (allUsers.getUser(currentUserName).brogueProcess){
            //    this.sendMessage("duplicate brogue", data);
            //    return;
            //}

            var self = this;
            var childWorkingDir = this.getChildWorkingDir();
            var args = ["--no-menu"]; // the flames on the brogue menu will crash most clients since it sends too much data at once

            if (data) {
                if (data.savedGame) {
                    var savedGamePath = path.normalize(childWorkingDir + "/" + data.savedGame);
                    fs.access(savedGamePath, fs.F_OK, function (err) {
                        if (err) {
                            self.controllers.error.send("Saved Game Not Found: '" + data.savedGame + "' does not exist");
                            return;
                        }

                        args.push("-o");
                        args.push(data.savedGame);

                        self.spawnChildProcess(args, childWorkingDir);
                    });
                }
                else if (data.seed || data.seed === ""){
                    var seed = parseInt(data.seed, 10); 
                    
                    if (isNaN(seed) || seed < 1 || seed > 4294967295){
                        self.sendMessage("seed", {
                            result : "fail",
                            data : "Please enter a numerical seed between 1 and 4294967295"
                        });
                        return;
                    }
                    
                    self.sendMessage("seed", {
                        result : "success"
                    });
                    
                    args.push("-s");
                    args.push(seed);
                    
                    this.spawnChildProcess(args, childWorkingDir);
                }
                else{
                    this.controllers.error.send("Message data incorrectly set: " + JSON.stringify(data));
                }
            }
            else {

                //Support reconnect (TODO: for other modes, change structure?)

                //TODO: We already have a brogueSocket???

                //Test if we can send to server socket, if so, no need to spawn a new process, just attach

                this.brogueSocket = unixdgram.createSocket('unix_dgram', function(buf, rinfo) {
                });

                try {

                    var sendBuf = new Buffer(5);
                    sendBuf[0] = 0; //keystroke
                    sendBuf[1] = 0; //upper byte
                    sendBuf[2] = 105; //i
                    sendBuf[3] = 0; //mod
                    sendBuf[4] = 0; //mod

                    this.brogueSocket.send(sendBuf, 0, 5, this.getChildWorkingDir() + "/" + SERVER_SOCKET, function () {
                        console.error("ok to connect to socket - callback");
                    });

                    console.error("ok to connect to socket");
                    //Okay to connect through socket to running process
                    this.attachChildProcess();
                }
                catch(e) {
                    console.error("failed to connect to socket, spawning new process " + e);

                    this.spawnChildProcess(args, childWorkingDir);
                }
            }
        },
        
        clean: function (data) {
            
            // TODO - this function is for gracefully exiting brogue, right now we will just kill it            
            //Commented out temporarily so we can practice reconnecting
            //this.handlerCollection.kill.call(this, data);
        },
        
        kill: function (data) {
            if (! this.brogueChild){
                return;
            }
            this.brogueChild.kill('SIGINT');
            this.brogueChild = null;
        },
        
        mirrorDuplicate : function(data){
            var currentUserName = this.controllers.auth.currentUserName;
            this.commandeerUserChildProcess(currentUserName);
        },
        killDuplicate : function(data){
            allUsers.killUserProcess(this.controllers.auth.currentUserName);
        },
    },
    
    setState : function(state){
        this.currentState = state;
        allUsers.users[this.controllers.auth.currentUserName].brogueState = state;
    },
    
    spawnChildProcess: function (args, childWorkingDir) {
        var options = {
            cwd: childWorkingDir,
            detached: true,
            stdio: 'ignore'
        };
        this.brogueChild = childProcess.spawn(config.path.BROGUE, args, options);
        allUsers.users[this.controllers.auth.currentUserName].brogueProcess = this.brogueChild;
        //TODO: We need to use the presence of the socketLink, not the processLink
        this.attachChildProcess();
    },

    attachChildProcess: function() {
        this.attachChildEvents();
        this.controllers.lobby.stopUserDataListen();
        this.setState(brogueState.PLAYING);
    },
    
    commandeerUserChildProcess : function(userName){
        this.brogueChild = allUsers.users[this.controllers.auth.currentUserName].brogueProcess;
        this.attachChildEvents();
        this.controllers.lobby.stopUserDataListen();
        this.setState(brogueState.PLAYING);
    },

    attachChildEvents: function () {
        var self = this;

        //Setup sockets

        //Client read socket

        try { fs.unlinkSync(this.getChildWorkingDir() + "/" + CLIENT_SOCKET); } catch (e) { /* swallow */ }

        //TODO: Return to the lobby cleanly on server error

        var client_read = unixdgram.createSocket('unix_dgram', function(data, rinfo) {
            //console.error('data: (%d, %d) -> %s', data[0], data[1], String.fromCharCode(data[3]));

            //Speed debugging
            //var d = new Date();
            //console.error(d.getTime());

            // Ensure that we send out data in chunks divisible by CELL_MESSAGE_SIZE and save any left over for the next data event
            // While it would be more efficient to accumulate all the data here on the server, I want the client to be able to start processing this data as it is being returned.
            var dataLength = data.length;

            //console.error(dataLength);

            var remainderLength = self.dataRemainder.length;
            var numberOfCellsToSend = (dataLength + remainderLength) / CELL_MESSAGE_SIZE | 0;  // |0 is still 2x faster than Math.floor or parseInt
            var sizeOfCellsToSend = numberOfCellsToSend * CELL_MESSAGE_SIZE;
            var newReminderLength = dataLength + remainderLength - sizeOfCellsToSend;

            //fill the data to send
            self.dataAccumulator = new Buffer(sizeOfCellsToSend);
            self.dataRemainder.copy(self.dataAccumulator);
            data.copy(self.dataAccumulator, remainderLength, 0, dataLength - newReminderLength);

            //save the remaining data for next time
            self.dataRemainder = new Buffer(newReminderLength);
            data.copy(self.dataRemainder, 0, dataLength - newReminderLength, dataLength);

            //check for status updates in data and update user object.
            for (var i = 0; i < sizeOfCellsToSend; i += CELL_MESSAGE_SIZE){
                if (self.dataAccumulator[i] === STATUS_BYTE_FLAG){
                    var updateFlag = self.dataAccumulator[i + STATUS_DATA_OFFSET];

                    // We need to send 4 bytes over as unsigned long.  JS bitwise operations force a signed long, so we are forced to use a float here.
                    var updateValue =
                        self.dataAccumulator[i + STATUS_DATA_OFFSET + 1] * 16777216 +
                        self.dataAccumulator[i + STATUS_DATA_OFFSET + 2] * 65536 +
                        self.dataAccumulator[i + STATUS_DATA_OFFSET + 3] * 256 +
                        self.dataAccumulator[i + STATUS_DATA_OFFSET + 4]

                    allUsers.updateLobbyStatus(
                        self.controllers.auth.currentUserName,
                        updateFlag,
                        updateValue);
                }
            }

            self.ws.send(self.dataAccumulator, {binary: true}, self.defaultSendCallback.bind(self));
        });

        client_read.bind(this.getChildWorkingDir() + "/" + CLIENT_SOCKET);

        //Server write socket
        this.brogueSocket = unixdgram.createSocket('unix_dgram', function(buf, rinfo) {
            //console.error('client recv', arguments);
            //assert(0);
        });

        //TODO: this guarding is for the reconnect case. Should be handled differently
        if(self.brogueChild) {

            self.brogueChild.on('exit', function (code) {
                // go back to lobby in the event something happens to the child process
                self.brogueChild = null;
                allUsers.users[self.controllers.auth.currentUserName].brogueProcess = null;
                self.sendMessage("quit", true);
                self.setState(brogueState.INACTIVE);
                self.controllers.lobby.sendAllUserData();
                self.controllers.lobby.userDataListen();
            });

            self.brogueChild.on('error', function (err) {
                self.controller.error.send('Message could not be sent to brogue process - Error: ' + err);
            });
        }
    }
});

module.exports = BrogueController;