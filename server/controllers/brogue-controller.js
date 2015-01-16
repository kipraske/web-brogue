var _ = require('underscore');
var config = require('../config');
var childProcess = require('child_process');

var router = require('./router');
var Controller = require('./controller-base');

var CELL_MESSAGE_SIZE = 10;

// Controller for handling I/O with brogue process and client.  Note that unlike other controllers this one deals in binary data. Any incoming or outgoing binary data from this server should only come from this controller.

function BrogueController(ws, sharedControllers) {
    this.ws = ws;
    this.error = sharedControllers.error;
    this.auth = null; // because of cross dependency, we will set this manually

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
        // TODO - validate incoming data before passing in   
        if (this.brogueChild) {
            this.brogueChild.stdin.write(message);
        }
    },
    
    handleIncomingJSONMessage: function (message) {
        if (this.handlerCollection[message.type]) {
            this.handlerCollection[message.type].call(this, message.data);
        }
        else {
            this.error.send("Message type incorrectly set: " + JSON.stringify(message));
        }
    },
    handlerCollection: {
        //TODO - validate data when needed -- I mean we don't want anything crazy getting passed in as arguments and crashing the server

        start: function (data) {
            var currentUserName = this.auth.currentUserName;

            if (!currentUserName || this.brogueChild){
                return;
            }

            var childWorkingDir = config.GAME_DATA_DIR + currentUserName;
            this.spawnChildProcess(data, childWorkingDir);
            this.attachChildEvents();
        },
        
        clean: function (data) {
            
            // TODO - this function is for gracefully exiting brogue, right now we will just kill it            
            this.handlerCollection.kill.call(this, data);
        },
        
        kill: function (data) {
            if (! this.brogueChild){
                return;
            }
            this.brogueChild.kill('SIGINT');
            this.brogueChild = null;
        }
    },
    
    spawnChildProcess: function (data, childWorkingDir) {
        var options = {            
            cwd : childWorkingDir
        };
        var args = [];
        this.brogueChild = childProcess.spawn(config.BROGUE_PATH, args, options);
    },
    attachChildEvents: function () {
        var self = this;

        self.brogueChild.stdout.on('data', function (data) {

            // Ensure that we send out data in chunks divisible by CELL_MESSAGE_SIZE and save any left over for the next data event
            // While it would be more efficient to accumulate all the data here on the server, I want the client to be able to start processing this data as it is being returned.
            var dataLength = data.length;
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

            self.ws.send(self.dataAccumulator, {binary: true});
        });
    }
});

module.exports = BrogueController;