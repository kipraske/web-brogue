var _ = require('underscore');
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

                //TODO: there will be many more - keypress, mouseclick, end etc.

            default :
                var errorMessage = this.prepareDataForSending("error", "invalid message recieved" + JSON.stringify(message));
                ws.send(errorMessage);
        }
    };

    this.spawnChildProcess = function(args) {
        var options = {};

        //TODO get this path in some sort of global thing - clean this up to be more generic;  Not going to be using the test instance forever after all;
        var path = require('path');
        var BROGUE_PATH = path.normalize(__dirname + "\\..\\tests\\fauxbrogue.js");
        console.log(BROGUE_PATH);
        args = [BROGUE_PATH];
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