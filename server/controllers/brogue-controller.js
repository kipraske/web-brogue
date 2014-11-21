var _ = require('underscore');

var router = require('./router');
var Controller = require('./controller-base');

// The model will keep track of the brogue data for the particular socket

function BrogueController(ws){
    this.controllerName = "brogue"; 
    
    // TODO - instance specific stuff - convieninetly tied to specific instance of websocket
    
    // constructor
        // register handlers?
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