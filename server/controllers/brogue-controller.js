var _ = require('underscore');
var config = require('../config');
var childProcess = require('child_process');

var router = require('./router');
var Controller = require('./controller-base');

// The model will keep track of the brogue data for the particular socket

function BrogueController(ws, user) {
    var self = this;
    this.controllerName = "brogue";

    this.brogueChild;

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
                var errorMessage = this.prepareDataForSending("error", "invalid message recieved: " + JSON.stringify(message));
                ws.send(errorMessage);
        }
    };

    this.spawnChildProcess = function(args) {
        var options = {};
        args = [config.BROGUE_PATH];
        console.log("should be after this");
        console.log[config.BROGUE_PATH];
        self.brogueChild = childProcess.spawn("node", args, options);
    };

    this.attachChildEvents = function() {
        self.brogueChild.stdout.on('data', function(chunk) {
            ws.send(chunk, {binary: true});
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