var config = require('../config');
var _ = require('underscore');
var Controller = require('./controller-base');
var allUsers = require('../user/all-users');

// Controller for sending game information to the lobby as well as routing watching a game

function LobbyController(ws, sharedControllers) {
    this.ws = ws;
    this.error = sharedControllers.error;
    this.brogue = sharedControllers.brogue;
    this.auth = sharedControllers.auth;
}

LobbyController.prototype = new Controller();
_.extend(LobbyController.prototype, {
    controllerName: "lobby",
    handlerCollection: {
    }
    
});

module.exports = LobbyController;
