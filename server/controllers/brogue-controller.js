var _ = require('underscore');
var config = require('../config');
var childProcess = require('child_process');

var router = require('./router');
var Controller = require('./controller-base');

var CELL_MESSAGE_SIZE = 9;

// The model will keep track of the brogue data for the particular socket

function BrogueController(ws, user) {
    var self = this;
    this.controllerName = "brogue";

    this.brogueChild;  // child process
    this.dataAccumulator; // buffer
    this.dataRemainder = new Buffer(0);  

    this.handleIncomingMessage = function(message) {
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
                    self.brogueChild.stdin.write(message.data + "\n");
                }
                break;
            case "click" :
                // TODO: this is a test case, will have to process a bit more strongly
                if (self.brogueChild) {
                    self.brogueChild.stdin.write(message.data + "\n");
                }
                break;
            default :
                var errorMessage = self.prepareDataForSending("error", "invalid message recieved: " + JSON.stringify(message));
                ws.send(errorMessage);
        }
    };

    this.spawnChildProcess = function(args) {
        var options = {};
        args = [];
        self.brogueChild = childProcess.spawn(config.BROGUE_PATH, args, options);
    };

    this.attachChildEvents = function() {

        console.log("expected total bytes: 30600");

        self.brogueChild.stdout.on('data', function(data) {
            
            console.log("data event started");
            
            var dataLength = data.length;
            var remainderLength = self.dataRemainder.length;
            var numberOfCellsToSend = (dataLength + remainderLength) / CELL_MESSAGE_SIZE | 0;  // |0 is still 2x faster than Math.floor, so we use that here though it is not so easy to read.
            var sizeOfCellsToSend = numberOfCellsToSend * CELL_MESSAGE_SIZE;
            var newReminderLength = dataLength + remainderLength - sizeOfCellsToSend;
            
            console.log("dataLength: %s\n remainderLength: %s\n numberOfCells: %s\n sizeOfCells: %s\n newRemainder: %s\n", dataLength, remainderLength,numberOfCellsToSend, sizeOfCellsToSend, newReminderLength);
            
            //fill the data to send 
            self.dataAccumulator = new Buffer(sizeOfCellsToSend);
            self.dataRemainder.copy(self.dataAccumulator);
            data.copy(self.dataAccumulator, remainderLength, 0, dataLength - newReminderLength);
            
            //save the remaining data for next time
            self.dataRemainder = new Buffer(newReminderLength);
            data.copy(self.dataRemainder, 0, dataLength - newReminderLength, dataLength);
            
            ws.send(self.dataAccumulator, {binary: true});     
        });
        
        /*
        self.brogueChild.stdout.on('readable', function() { 
            var chunk = self.brogueChild.stdout.read(CELL_MESSAGE_SIZE);
            while (chunk !== null) {
                ws.send(chunk, {binary: true});
                chunk = self.brogueChild.stdout.read(CELL_MESSAGE_SIZE);
            }         
        });
        */
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