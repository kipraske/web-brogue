var _ = require('underscore');
var config = require('../config');
var childProcess = require('child_process');

var router = require('./router');
var Controller = require('./controller-base');

var CELL_MESSAGE_SIZE = 9;

// Controller for handling I/O with brogue process and client.  Note that unlike other controllers this one deals in binary data. Any incoming or outgoing binary data from this server should only come from this controller.

function BrogueController(ws, user, error) {
    var self = this;
    this.ws = ws;
    this.user = user;
    this.controllerName = "brogue";

    this.brogueChild;  // child process
    this.dataAccumulator; // buffer
    this.dataRemainder = new Buffer(0);  

    this.handleIncomingMessage = function(message) {
        
        if (message instanceof ArrayBuffer){
            this.handleIncomingBinaryMessage();
        }
        
        switch (message.type) {
            case "play" :
                //if user status is authenticated TODO else don't do nuthin
                this.spawnChildProcess([]);
                this.attachChildEvents();
                break;
            // TODO : case "watch" where we look up an existing process
            case "key" : 
                // TODO: this is a test case, will have to process a bit more strongly
                if (self.brogueChild) {
                    self.brogueChild.stdin.write(message.data);
                }
                break;
            case "click" :
                // TODO: this is a test case, will have to process a bit more strongly
                if (self.brogueChild) {
                    self.brogueChild.stdin.write(message.data);
                }
                break;
            default :
                error.send("Invalid message recieved: " + JSON.stringify(message));
        }
    };

    this.spawnChildProcess = function(args) {
        var options = {};
        args = [];
        self.brogueChild = childProcess.spawn(config.BROGUE_PATH, args, options);
    };

    this.attachChildEvents = function() {

        self.brogueChild.stdout.on('data', function(data) {
            
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
            
            ws.send(self.dataAccumulator, {binary: true});     
        });
    };
}

BrogueController.prototype = new Controller();
_.extend(BrogueController.prototype, {
    // TODO - things that we want to share between all instances

    // perhaps the handlers should just be here (who needs a router?)... uh well we need to know what manager to use.
    // maybe if I set up the messages to be 
    // manager - brogue
    // type - keypress
    // data - payload
});

module.exports = BrogueController;