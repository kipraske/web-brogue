var _ = require('underscore');

var router = require('./router');
var Controller = require('./controller-base');
var brogueState = require('../enum/brogue-state');
var allUsers = require('../user/all-users');

var brogueComms = require('../brogue/brogue-comms');

// Controller for handling I/O with brogue process and client.  Note that unlike other controllers this one deals in binary data. Any incoming or outgoing binary data from this server should only come from this controller.

function BrogueController(ws) {
    this.controllerName = "brogue";
    this.ws = ws;
    this.controllers = null;
    this.username;
    
    this.currentState = brogueState.INACTIVE;
    this.brogueInterface;

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

    handlerCollection: {
        start: function (data) {

            console.log("brogue-controller.start")
            //TODO: assuming data has the username of the session to get

            var brogueSessionName;

            if(!data || !data.username) {
                brogueSessionName = this.controllers.auth.currentUserName;
            }
            else {
                brogueSessionName = data.username;
            }

            this.username = brogueSessionName; //for debugging

            //(could do this in callback style, since it's kinda IO
            this.brogueInterface = brogueComms.getBrogueInterface(brogueSessionName);

            var self = this;

            this.brogueInterface.addDataListener(function (data) {
                self.ws.send(data, {binary: true}, self.defaultSendCallback.bind(self));
            });

            this.brogueInterface.addQuitListener(function () {
                console.log("Quit listener" + self.username);
                self.sendMessage("quit", true);
                self.setState(brogueState.INACTIVE);
                self.controllers.lobby.sendAllUserData();
                self.controllers.lobby.userDataListen();
            });

            this.controllers.lobby.stopUserDataListen();
            this.setState(brogueState.PLAYING);

            //TODO: Handle errors


        },
        
        clean: function (data) {
            
            // TODO - this function is for gracefully exiting brogue, right now we will just kill it            
            //Commented out temporarily so we can practice reconnecting - seems to be called on logout (window close)
            //this.handlerCollection.kill.call(this, data);
        },

        //TODO: If required, this needs to migrate to interface
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